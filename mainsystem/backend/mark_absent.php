<?php
// mark_absent.php
date_default_timezone_set('Asia/Manila');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// === Settings ===
$DEBUG = true; // set to false in production
$force = isset($_GET['force']) && ($_GET['force'] === '1' || strtolower($_GET['force']) === 'true');

// === DB Connection ===
$host = "localhost";
$db   = "trac_system";
$user = "root";
$pass = "";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Database connection failed",
        "details" => $conn->connect_error
    ]);
    exit;
}
$conn->set_charset('utf8mb4');

// === Time Settings ===
$today = date('Y-m-d');
$now   = date('H:i:s');

// Department & cutoff groups
$collegeDepts = ["ABEL","BEED","BSA","BSBA","BSCE","BSED","BSHM","BSTM","BSIT","BSMA"];
$shsStrands   = ["STEM","HUMSS","ABM","GAS"];
$cutoffTimes  = [
    "JHS"     => "16:00:00",
    "SHS"     => "16:00:00",
    "College" => "21:00:00"
];

// === Fetch Students ===
$students = $conn->query("SELECT barcode_id, student_name, year_level, department FROM students");
if (!$students) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Failed to fetch students",
        "details" => $conn->error
    ]);
    exit;
}

// === Vars ===
$absentCount = 0;
$marked = [];
$skipped = [];
$errors  = [];

// === Transaction Start ===
$conn->begin_transaction();

// Prepared statements
$selectStmt = $conn->prepare("
    SELECT id 
    FROM attendance 
    WHERE barcode_id = ? 
    AND DATE(created_at) = ?
");
if (!$selectStmt) {
    $conn->rollback();
    echo json_encode([
        "success" => false,
        "error"   => "Prepare SELECT failed",
        "details" => $conn->error
    ]);
    exit;
}

$insertStmt = $conn->prepare("
    INSERT INTO attendance (barcode_id, student_name, year_level, department, status, created_at) 
    VALUES (?, ?, ?, ?, ?, NOW())
");
if (!$insertStmt) {
    $conn->rollback();
    echo json_encode([
        "success" => false,
        "error"   => "Prepare INSERT failed",
        "details" => $conn->error
    ]);
    exit;
}

// === Loop Students ===
while ($student = $students->fetch_assoc()) {
    $barcode     = trim((string)($student['barcode_id'] ?? ''));
    $studentName = $student['student_name'] ?? '';
    $yearLevel   = $student['year_level'] ?? '';
    $department  = strtoupper(trim((string)($student['department'] ?? '')));

    if ($barcode === '') {
        $skipped[] = [
            "reason"  => "no barcode",
            "student" => $studentName
        ];
        continue;
    }

    // Determine group
    if (in_array($department, $collegeDepts, true)) {
        $group = "College";
    } elseif (in_array($department, $shsStrands, true)) {
        $group = "SHS";
    } elseif (stripos($yearLevel, "Grade") !== false) {
        $gradeNum = intval(preg_replace('/[^0-9]/', '', $yearLevel));
        $group = ($gradeNum >= 11 ? "SHS" : "JHS");
    } else {
        $group = "College";
    }

    $cutoff = $cutoffTimes[$group] ?? "21:00:00";

    // Skip if before cutoff (unless force mode)
    if (!$force && $now < $cutoff) {
        $skipped[] = [
            "reason"  => "before cutoff",
            "student" => $studentName,
            "group"   => $group,
            "cutoff"  => $cutoff,
            "now"     => $now
        ];
        continue;
    }

    // Check existing attendance
    $selectStmt->bind_param("ss", $barcode, $today);
    if (!$selectStmt->execute()) {
        $errors[] = [
            "student" => $studentName,
            "stage"   => "select_execute",
            "details" => $selectStmt->error
        ];
        continue;
    }
    $res = $selectStmt->get_result();
    $already = $res->num_rows > 0;
    $res->free();

    if ($already) {
        $skipped[] = [
            "reason"  => "already recorded",
            "student" => $studentName
        ];
        continue;
    }

    // Insert Absent record
    $status = "Absent";
    $insertStmt->bind_param("sssss", $barcode, $studentName, $yearLevel, $department, $status);
    if (!$insertStmt->execute()) {
        $errors[] = [
            "student" => $studentName,
            "stage"   => "insert_execute",
            "details" => $insertStmt->error
        ];
        continue;
    }

    $absentCount++;
    $marked[] = [
        "student" => $studentName,
        "barcode" => $barcode
    ];
}

// === Commit or Rollback ===
if (count($errors) === 0) {
    $conn->commit();
} else {
    $conn->rollback();
}

// Cleanup
$selectStmt->close();
$insertStmt->close();
$students->free();
$conn->close();

// === Response ===
$response = [
    "success"       => count($errors) === 0,
    "absent_marked" => $absentCount,
    "marked"        => $marked,
    "skipped"       => $skipped,
    "errors"        => $errors,
    "now"           => $now,
    "today"         => $today,
    "force"         => $force
];

if ($DEBUG) {
    echo json_encode($response, JSON_PRETTY_PRINT);
} else {
    echo json_encode($response);
}
