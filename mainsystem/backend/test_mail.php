<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . "/PHPMailer-master/src/PHPMailer.php";
require __DIR__ . "/PHPMailer-master/src/SMTP.php";
require __DIR__ . "/PHPMailer-master/src/Exception.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // SMTP Settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'rcctracs@gmail.com'; // your Gmail
    $mail->Password   = 'gobnhwdtgelo sqeg'; // your App Password (no spaces)
    $mail->SMTPSecure = 'tls'; // try 'ssl' first
    $mail->Port       = 587;

    // Email settings
    $mail->setFrom('rcctracs@gmail.com', 'TRAC Test');
    $mail->addAddress('rcctracs@gmail.com', 'Test User');
    $mail->isHTML(true);
    $mail->Subject = 'PHPMailer Gmail Test';
    $mail->Body    = '<h1>This is a test email from PHPMailer</h1>';

    // Send email
    if ($mail->send()) {
        echo "✅ Test email sent successfully!";
    } else {
        echo "❌ Email could not be sent.";
    }

} catch (Exception $e) {
    echo "❌ PHPMailer Error: {$mail->ErrorInfo}";
}
