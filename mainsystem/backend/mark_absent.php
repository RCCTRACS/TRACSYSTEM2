<?php
date_default_timezone_set('Asia/Manila');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// DB Connection
$host = "localhost";
$db   = "trac_system";
$user = "root";
$pass = ""; 
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$today = date('Y-m-d');

// 1. Fetch all students
$students = $conn->query("SELECT barcode_id, student_name, year_level, department FROM students");

if (!$students) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to fetch students"]);
    exit;
}

$absentCount = 0;

while ($student = $students->fetch_assoc()) {
    $barcode     = $student['barcode_id'];
    $studentName = $student['student_name'];
    $yearLevel   = $student['year_level'];
    $department  = $student['department'];

    // 2. Check if student already has attendance record today
    $stmt = $conn->prepare("SELECT id FROM attendance WHERE barcode_id = ? AND DATE(created_at) = ?");
    $stmt->bind_param("ss", $barcode, $today);
    $stmt->execute();
    $result = $stmt->get_result();
    $alreadyRecorded = $result->num_rows > 0;
    $stmt->close();

    // 3. If not, insert absent record
    if (!$alreadyRecorded) {
        $status = "Absent";
        $stmtInsert = $conn->prepare("
            INSERT INTO attendance (barcode_id, student_name, year_level, department, status) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmtInsert->bind_param("sssss", $barcode, $studentName, $yearLevel, $department, $status);
        $stmtInsert->execute();
        $stmtInsert->close();

        $absentCount++;
    }
}

echo json_encode([
    "success" => true,
    "message" => "Absent marking complete",
    "absent_marked" => $absentCount
]);

$conn->close();
?>
