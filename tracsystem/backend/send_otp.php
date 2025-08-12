<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

require_once(__DIR__ . "/../database/db_config.php");
require_once(__DIR__ . "/PHPMailer-master/src/PHPMailer.php");
require_once(__DIR__ . "/PHPMailer-master/src/SMTP.php");
require_once(__DIR__ . "/PHPMailer-master/src/Exception.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['userId']) || empty($input['email'])) {
    echo json_encode(["success" => false, "message" => "Missing user ID or email"]);
    exit;
}

$userId = intval($input['userId']);
$email = trim($input['email']);

// Generate OTP
$otp = rand(100000, 999999);
$expiresAt = date("Y-m-d H:i:s", strtotime("+5 minutes"));

// Store OTP in DB
$stmt = $conn->prepare("INSERT INTO user_otps (user_id, otp_code, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $userId, $otp, $expiresAt);
$stmt->execute();
$stmt->close();

// Send email
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
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ];

    $mail->setFrom('rcctracs@gmail.com', 'TRAC System');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Your OTP Code';
    $mail->Body    = "<h3>Your OTP Code is: <b>$otp</b></h3><p>This code will expire in 5 minutes.</p>";

    $mail->send();
    echo json_encode(["success" => true, "message" => "OTP sent successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Mailer Error: " . $mail->ErrorInfo]);
}
