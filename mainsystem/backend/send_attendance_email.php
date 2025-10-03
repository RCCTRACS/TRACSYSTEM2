<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once(__DIR__ . "/../database/db_config.php");
require_once(__DIR__ . "/PHPMailer-master/src/PHPMailer.php");
require_once(__DIR__ . "/PHPMailer-master/src/SMTP.php");
require_once(__DIR__ . "/PHPMailer-master/src/Exception.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Read input
$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['barcode_id'])) {
    echo json_encode(["success" => false, "message" => "Missing barcode ID"]);
    exit;
}

$barcodeId = trim($input['barcode_id']);

// 🔹 Get student info
$stmt = $conn->prepare("SELECT student_name, parent_email FROM students WHERE barcode_id = ?");
$stmt->bind_param("s", $barcodeId);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc();
$stmt->close();

if (!$student) {
    echo json_encode(["success" => false, "message" => "Student not found"]);
    exit;
}

// 🔹 Get latest attendance record
$stmt = $conn->prepare("
    SELECT time_in 
    FROM attendance 
    WHERE barcode_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
");
$stmt->bind_param("s", $barcodeId);
$stmt->execute();
$result = $stmt->get_result();
$attendance = $result->fetch_assoc();
$stmt->close();

if (!$attendance || empty($attendance['time_in'])) {
    echo json_encode(["success" => false, "message" => "No attendance record found"]);
    exit;
}

$timeIn      = date("h:i A", strtotime($attendance['time_in']));
$studentName = htmlspecialchars($student['student_name']);
$parentEmail = filter_var($student['parent_email'], FILTER_SANITIZE_EMAIL);

// 🔹 Send email
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'rcctracs@gmail.com'; // your Gmail
    $mail->Password   = 'gobn hwdt gelo sqeg'; // your Gmail App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ]
    ];

    $mail->setFrom('rcctracs@gmail.com', 'TRAC System');
    $mail->addAddress($parentEmail);

    $mail->isHTML(true);
    $mail->Subject = "Attendance Notification - RCC";
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
        <img src="https://i.ibb.co/twYJMHCY/logo.png" 
             alt="TRAC System" 
             style="width:100px;height:100px;object-fit:contain;margin-bottom:18px;" />
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:18px;">Attendance Notification</h2>
        <p style="font-size:1.1rem;margin-bottom:18px;">
          Your child, <b>' . $studentName . '</b> has entered RCC at:
        </p>
        <div style="font-size:2rem;font-weight:700;color:#5b3a1a;margin-bottom:18px;">' . $timeIn . '</div>
        <p style="font-size:1rem;color:#444;margin-bottom:0;">
          This is an automated attendance notification.
        </p>
      </div>
    ';

    $mail->send();
    echo json_encode(["success" => true, "message" => "Attendance email sent to parent"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Mailer Error: " . $mail->ErrorInfo]);
}
