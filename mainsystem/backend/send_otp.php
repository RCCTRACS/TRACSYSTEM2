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
$stmt = $conn->prepare("INSERT INTO otp_codes (user_id, otp_code, expires_at) VALUES (?, ?, ?)");
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
    $mail->Subject = 'OTP CODE';
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
        <img src="https://i.postimg.cc/x1mTm0zX/logo.png" alt="TRAC System" style="width:100px;height:100px;object-fit:contain;margin-bottom:18px;" />
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:18px;">TRAC System</h2>
        <p style="font-size:1.1rem;margin-bottom:18px;">Your OTP Code is:</p>
        <div style="font-size:2.4rem;font-weight:700;color:#5b3a1a;letter-spacing:2px;margin-bottom:18px;">' . $otp . '</div>
        <p style="font-size:1rem;color:#444;margin-bottom:0;">This code will expire in 5 minutes.</p>
      </div>
    ';

    $mail->send();
    echo json_encode(["success" => true, "message" => "OTP sent successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Mailer Error: " . $mail->ErrorInfo]);
}



?>

