<?php
date_default_timezone_set('Asia/Manila');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // ⚠️ Restrict in production
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$DEBUG = false;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// DB Connection
$host = "localhost";
$db   = "trac_system";
$user = "root";
$pass = "";
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database connection failed", "details" => $conn->connect_error]);
    exit;
}

// PHPMailer
require_once(__DIR__ . "/PHPMailer-master/src/PHPMailer.php");
require_once(__DIR__ . "/PHPMailer-master/src/SMTP.php");
require_once(__DIR__ . "/PHPMailer-master/src/Exception.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


// --- Attendance rules per department/year/strand ---
$attendanceRules = [
    // College (afternoon defaults)
    "ABEL" => [
        "1st Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "2nd Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "3rd Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "4th Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
    ],
    "BEED" => [
        "1st Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
        "2nd Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
        "3rd Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
        "4th Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
    ],
    "BSA" => [
        "1st Year" => ["start" => "14:00:00", "grace" => "14:15:00"],
        "2nd Year" => ["start" => "14:00:00", "grace" => "14:15:00"],
        "3rd Year" => ["start" => "14:00:00", "grace" => "14:15:00"],
        "4th Year" => ["start" => "14:00:00", "grace" => "14:15:00"],
    ],
    "BSBA" => [
        "1st Year" => ["start" => "13:00:00", "grace" => "13:20:00"],
        "2nd Year" => ["start" => "13:00:00", "grace" => "13:20:00"],
        "3rd Year" => ["start" => "13:00:00", "grace" => "13:20:00"],
        "4th Year" => ["start" => "13:00:00", "grace" => "13:20:00"],
    ],
    "BSCE" => [
        "1st Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
        "2nd Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
        "3rd Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
        "4th Year" => ["start" => "13:30:00", "grace" => "13:45:00"],
    ],
    "BSED" => [
        "1st Year" => ["start" => "13:15:00", "grace" => "13:30:00"],
        "2nd Year" => ["start" => "13:15:00", "grace" => "13:30:00"],
        "3rd Year" => ["start" => "13:15:00", "grace" => "13:30:00"],
        "4th Year" => ["start" => "13:15:00", "grace" => "13:30:00"],
    ],
    "BSHM" => [
        "1st Year" => ["start" => "14:00:00", "grace" => "14:10:00"],
        "2nd Year" => ["start" => "14:00:00", "grace" => "14:10:00"],
        "3rd Year" => ["start" => "14:00:00", "grace" => "14:10:00"],
        "4th Year" => ["start" => "14:00:00", "grace" => "14:10:00"],
    ],
    "BSTM" => [
        "1st Year" => ["start" => "14:30:00", "grace" => "14:45:00"],
        "2nd Year" => ["start" => "14:30:00", "grace" => "14:45:00"],
        "3rd Year" => ["start" => "14:30:00", "grace" => "14:45:00"],
        "4th Year" => ["start" => "14:30:00", "grace" => "14:45:00"],
    ],
    "BSIT" => [
        "1st Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "2nd Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "3rd Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "4th Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
    ],
    "BSMA" => [
        "1st Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "2nd Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "3rd Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
        "4th Year" => ["start" => "13:00:00", "grace" => "13:15:00"],
    ],
    // JHS
    "JHS" => [
        "Grade 7"  => ["start" => "07:00:00", "grace" => "07:15:00"],
        "Grade 8"  => ["start" => "07:00:00", "grace" => "07:15:00"],
        "Grade 9"  => ["start" => "07:00:00", "grace" => "07:15:00"],
        "Grade 10" => ["start" => "07:00:00", "grace" => "07:15:00"],
    ],
    // SHS
    "STEM" => [
        "Grade 11" => ["start" => "07:00:00", "grace" => "07:15:00"],
        "Grade 12" => ["start" => "07:00:00", "grace" => "07:15:00"],
    ],
    "HUMSS" => [
        "Grade 11" => ["start" => "08:00:00", "grace" => "08:20:00"],
        "Grade 12" => ["start" => "08:00:00", "grace" => "08:20:00"],
    ],
    "ABM" => [
        "Grade 11" => ["start" => "08:30:00", "grace" => "08:45:00"],
        "Grade 12" => ["start" => "08:30:00", "grace" => "08:45:00"],
    ],
    "GAS" => [
        "Grade 11" => ["start" => "09:00:00", "grace" => "09:15:00"],
        "Grade 12" => ["start" => "09:00:00", "grace" => "09:15:00"],
    ]
];

$collegeDepts = ["ABEL","BEED","BSA","BSBA","BSCE","BSED","BSHM","BSTM","BSIT","BSMA"];
$shsStrands = ["STEM","HUMSS","ABM","GAS"];

// Cutoff times for absents
$cutoffTimes = [
    "JHS" => "16:00:00",
    "SHS" => "16:00:00",
    "College" => "21:00:00"
];

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (!$input && stripos($contentType, "application/x-www-form-urlencoded") !== false) {
    $input = $_POST;
}

// ------------------- GET -------------------
if ($method === 'GET') {
    $today = date('Y-m-d');
    $stmt = $conn->prepare("SELECT * FROM attendance WHERE DATE(created_at) = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $result = $stmt->get_result();

    $attendances = [];
    while ($row = $result->fetch_assoc()) {
        $row['time_in']  = $row['time_in']  ? date("h:i A", strtotime($row['time_in'])) : null;
        $row['time_out'] = $row['time_out'] ? date("h:i A", strtotime($row['time_out'])) : null;
        $attendances[] = $row;
    }

    echo json_encode($attendances);
    $stmt->close();
    exit;
}


// ------------------- POST -------------------
if ($method === 'POST') {
    $barcode = $input['barcode_id'] ?? null;
    $today   = date('Y-m-d');

    $manualTime = $input['time_in'] ?? null;
    $timeIn = $manualTime ? date("H:i:s", strtotime($manualTime)) : date('H:i:s');

    if (!$barcode) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing required field: barcode_id"]);
        exit;
    }

    // fetch student
    $stmtStudent = $conn->prepare("SELECT student_name, year_level, department, parent_email FROM students WHERE barcode_id = ?");
    $stmtStudent->bind_param("s", $barcode);
    $stmtStudent->execute();
    $studentResult = $stmtStudent->get_result();
    $student = $studentResult->fetch_assoc();
    $stmtStudent->close();

    if (!$student) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Student not found for barcode: $barcode"]);
        exit;
    }

    $studentName = $student['student_name'];
    $yearLevel   = $student['year_level'];
    $department  = $student['department'];
    $parentEmail = $student['parent_email'];

    // ---------- Determine applicable start & grace ----------
    $appliedRule = null;

    foreach ($attendanceRules as $deptKey => $years) {
        if (strcasecmp($deptKey, $department) === 0) {
            foreach ($years as $yKey => $rule) {
                if (strcasecmp($yKey, $yearLevel) === 0) {
                    $appliedRule = $rule;
                    break 2;
                }
            }
        }
    }

    if (!$appliedRule) {
        if (preg_match('/Grade\s*(\d+)/i', $yearLevel, $m)) {
            $gradeNum = intval($m[1]);
            if ($gradeNum >= 11) {
                $appliedRule = ["start" => "07:00:00", "grace" => "07:15:00"];
            } else {
                $appliedRule = ["start" => "07:00:00", "grace" => "07:15:00"];
            }
        } elseif (in_array(strtoupper($department), $collegeDepts, true)) {
            $appliedRule = ["start" => "13:00:00", "grace" => "13:15:00"];
        } elseif (in_array(strtoupper($department), $shsStrands, true)) {
            $appliedRule = ["start" => "07:00:00", "grace" => "07:15:00"];
        } else {
            $appliedRule = ["start" => "07:00:00", "grace" => "07:15:00"];
        }
    }

    $todayStr = date('Y-m-d');
    $timeInDT = new DateTime("$todayStr $timeIn", new DateTimeZone('Asia/Manila'));
    $graceDT = new DateTime("$todayStr " . $appliedRule['grace'], new DateTimeZone('Asia/Manila'));

    $status = ($timeInDT <= $graceDT) ? "Present" : "Late";

    // Check if student already has a record today
    $stmtCheck = $conn->prepare("SELECT id, time_in, time_out FROM attendance WHERE barcode_id = ? AND DATE(created_at) = ?");
    $stmtCheck->bind_param("ss", $barcode, $today);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    $existing = $resultCheck->fetch_assoc();
    $stmtCheck->close();

    if ($existing) {
        if ($existing['time_out'] === null) {
            $timeOut = $manualTime ? date("H:i:s", strtotime($manualTime)) : date("H:i:s");
            $stmtUpdate = $conn->prepare("UPDATE attendance SET time_out = ? WHERE id = ?");
            $stmtUpdate->bind_param("si", $timeOut, $existing['id']);
            $stmtUpdate->execute();
            $stmtUpdate->close();

            echo json_encode([
                "success"  => true,
                "message"  => "Time out recorded",
                "student"  => $student,
                "time_out" => date("h:i A", strtotime($timeOut))
            ]);
            exit;
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Student already timed out today",
                "student" => $student
            ]);
            exit;
        }
    } else {
        // Insert new attendance (time in)
        $stmtInsert = $conn->prepare("
            INSERT INTO attendance (barcode_id, student_name, year_level, department, time_in, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmtInsert->bind_param("ssssss", $barcode, $studentName, $yearLevel, $department, $timeIn, $status);
        $stmtInsert->execute();
        $id = $stmtInsert->insert_id;
        $stmtInsert->close();

        // --- Send parent email notification ---
        if (!empty($parentEmail)) {
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'rcctracs@gmail.com';
                $mail->Password   = 'gobn hwdt gelo sqeg'; // App password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    ]
                ];

                $mail->setFrom('rcctracs@gmail.com', 'TRAC System');
                $mail->addAddress($parentEmail);
                $mail->isHTML(true);
                $mail->Subject = 'Attendance Notification - RCC';
                $mail->Body = '
                  <div style="
                    font-family: Sora, Arial, sans-serif;
                    background: #f9f7f1;
                    border-radius: 24px;
                    border: 3px solid #5b3a1a;
                    max-width: 420px;
                    margin: 32px auto;
                    padding: 32px 24px;
                    color: #222;
                    text-align: center;
                  ">
                    <img src="https://scontent.fcrk1-5.fna.fbcdn.net/v/t39.30808-6/598618782_122279774894198393_5794352533800714966_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=c-Rk3Uqx_qEQ7kNvwH4uS-I&_nc_oc=AdlXW3j7M7OhIbQ4kJ9z3gfaDJyLb9DQrgoqV8mzfZ-3qw1A7yVErwzbEIu4zLIzvAI&_nc_zt=23&_nc_ht=scontent.fcrk1-5.fna&_nc_gid=UcHjZdacJ8ZJODy0FR3ygA&oh=00_AfnDFNcL3Rw-dI9tKMuCPIzGYe4-TgeBZhzvdYfIG43B9g&oe=6941347C" alt="TRAC System" style="width:100px;height:100px;object-fit:contain;margin-bottom:18px;" />
                    <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:18px;">Attendance Notification</h2>
                    <p style="font-size:1.1rem;margin-bottom:18px;">
                      Your child, <b>' . htmlspecialchars($studentName) . '</b> has entered RCC at:
                    </p>
                    <div style="font-size:2rem;font-weight:700;color:#5b3a1a;margin-bottom:18px;">' . date("h:i A", strtotime($timeIn)) . '</div>
                    <p style="font-size:1rem;color:#444;margin-bottom:0;">This is an automated attendance notification.</p>
                  </div>
                ';
                $mail->send();
            } catch (Exception $e) {
                if ($DEBUG) {
                    error_log("Mailer Error: " . $mail->ErrorInfo);
                }
            }
        }

        echo json_encode([
            "success" => true,
            "message" => "Time in recorded",
            "id"      => $id,
            "student" => $student,
            "time_in" => date("h:i A", strtotime($timeIn)),
            "status"  => $status
        ]);
        exit;
    }
}

// ------------------- PUT -------------------
if ($method === 'PUT') {
    $id      = $input['id']       ?? null;
    $timeOut = $input['time_out'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing attendance ID"]);
        exit;
    }

    $fields = [];
    $params = [];
    $types  = "";

    if ($timeOut !== null) {
        $timeOut = date("H:i:s", strtotime($timeOut));
        $fields[] = "time_out = ?";
        $params[] = $timeOut;
        $types   .= "s";
    }

    if (count($fields) === 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "No fields to update"]);
        exit;
    }

    $params[] = $id;
    $types   .= "i";

    $stmt = $conn->prepare("UPDATE attendance SET ".implode(", ", $fields)." WHERE id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare failed", "details" => $conn->error]);
        exit;
    }

    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Attendance updated successfully",
            "time_out" => $timeOut ? date("h:i A", strtotime($timeOut)) : null
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to update attendance", "details" => $stmt->error]);
    }
    $stmt->close();
    exit;
}

// ------------------- DELETE -------------------
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing attendance ID"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM attendance WHERE id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare failed", "details" => $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Attendance deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to delete attendance", "details" => $stmt->error]);
    }
    $stmt->close();
    exit;
}
// ------------------- ABSENT -------------------
if (isset($_GET['method']) && strtoupper($_GET['method']) === 'ABSENT') {
    $today = date('Y-m-d');
    $now   = date('H:i:s');
    $students = $conn->query("SELECT barcode_id, student_name, year_level, department FROM students");
    $absentCount = 0;

    while ($student = $students->fetch_assoc()) {
        $barcode     = $student['barcode_id'];
        $studentName = $student['student_name'];
        $yearLevel   = $student['year_level'];
        $department  = strtoupper($student['department']);

        if (in_array($department, $collegeDepts)) {
            $group = "College";
        } elseif (in_array($department, $shsStrands)) {
            $group = "SHS";
        } elseif (stripos($yearLevel, "Grade") !== false) {
            $gradeNum = intval(preg_replace('/[^0-9]/', '', $yearLevel));
            $group = ($gradeNum >= 11 ? "SHS" : "JHS");
        } else {
            $group = "College";
        }

        $cutoff = $cutoffTimes[$group];
        if ($now < $cutoff) continue;

        $stmt = $conn->prepare("SELECT id FROM attendance WHERE barcode_id = ? AND DATE(created_at) = ?");
        $stmt->bind_param("ss", $barcode, $today);
        $stmt->execute();
        $res = $stmt->get_result();
        $already = $res->num_rows > 0;
        $stmt->close();

        if (!$already) {
            $status = "Absent";
            $stmtInsert = $conn->prepare("INSERT INTO attendance (barcode_id, student_name, year_level, department, status) VALUES (?, ?, ?, ?, ?)");
            $stmtInsert->bind_param("sssss", $barcode, $studentName, $yearLevel, $department, $status);
            $stmtInsert->execute();
            $stmtInsert->close();
            $absentCount++;
        }
    }
    echo json_encode(["success" => true, "absent_marked" => $absentCount]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);
exit;

// ------------------- Fallback -------------------
http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);
exit;