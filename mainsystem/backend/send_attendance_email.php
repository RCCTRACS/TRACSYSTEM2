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

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['barcode_id']) || empty($input['status'])) {
    echo json_encode(["success" => false, "message" => "Missing required data"]);
    exit;
}

$barcodeId = trim($input['barcode_id']);
$status    = trim(strtolower($input['status'])); // "present" or "absent"

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

$studentName = htmlspecialchars($student['student_name']);
$parentEmail = filter_var($student['parent_email'], FILTER_SANITIZE_EMAIL);

// 🔹 Prepare email
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'rcctracs@gmail.com'; 
    $mail->Password   = 'dqre wgmc omcr lwwr'; // Gmail App Password
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

    if ($status === "present") {
        // 🔹 Get latest attendance record (time_in)
        $stmt = $conn->prepare("SELECT time_in FROM attendance WHERE barcode_id = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->bind_param("s", $barcodeId);
        $stmt->execute();
        $result = $stmt->get_result();
        $attendance = $result->fetch_assoc();
        $stmt->close();

        if (!$attendance || empty($attendance['time_in'])) {
            echo json_encode(["success" => false, "message" => "No attendance record found"]);
            exit;
        }

        $timeIn = date("h:i A", strtotime($attendance['time_in']));

        $mail->Body = '
          <div style="font-family:Sora,Arial,sans-serif;background:#f9f7f1;border-radius:24px;
          border:3px solid #5b3a1a;max-width:420px;margin:32px auto;padding:32px 24px;text-align:center;">
             <img src="https://i.ibb.co/1fx7h5R0/trac-seal.png" alt="RCC TRACS logo" border="0"  style="width:100px;height:100px;object-fit:contain;margin-bottom:18px;" />
                 style="width:100px;height:100px;object-fit:contain;margin-bottom:18px;" />
            <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:18px;">Attendance Notification</h2>
            <p style="font-size:1.1rem;margin-bottom:18px;">
              Your child, <b>' . $studentName . '</b> has entered RCC at:
            </p>
            <div style="font-size:2rem;font-weight:700;color:#5b3a1a;margin-bottom:18px;">' . $timeIn . '</div>
            <p style="font-size:1rem;color:#444;">This is an automated attendance notification.</p>
          </div>';
    } 
    elseif ($status === "absent") {
        $mail->Body = '
          <div style="font-family:Sora,Arial,sans-serif;background:#fff4f4;border-radius:24px;
          border:3px solid #b00020;max-width:420px;margin:32px auto;padding:32px 24px;text-align:center;">
            <img src="https://i.ibb.co/1fx7h5R0/trac-seal.png" alt="RCC TRACS logo" border="0"  style="width:100px;height:100px;object-fit:contain;margin-bottom:18px;" />
                 style="width:100px;height:100px;object-fit:contain;margin-bottom:18px;" />
            <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:18px;color:#b00020;">Absence Notification</h2>
            <p style="font-size:1.1rem;margin-bottom:18px;">
              Your child, <b>' . $studentName . '</b>, has been <b>marked absent</b> today.
            </p>
            <p style="font-size:1rem;color:#444;">This is an automated attendance notification.</p>
          </div>';
    } else {
        echo json_encode(["success" => false, "message" => "Invalid status value"]);
        exit;
    }

    $mail->send();
    echo json_encode(["success" => true, "message" => "Attendance email sent to parent"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Mailer Error: " . $mail->ErrorInfo]);
}
