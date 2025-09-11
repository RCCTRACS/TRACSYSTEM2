<?php
// ===== CORS HEADERS =====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

// ===== DB CONNECTION =====
require_once(__DIR__ . "/../database/db_config.php");

// ===== READ INPUT =====
$input = json_decode(file_get_contents("php://input"), true);
if (empty($input['userId']) || empty($input['otp'])) {
    echo json_encode(["success" => false, "message" => "Missing user ID or OTP"]);
    exit;
}

$userId = intval($input['userId']);
$otp    = trim($input['otp']);

// ===== GET LATEST OTP =====
$stmt = $conn->prepare("
    SELECT id, otp_code, expires_at
    FROM otp_codes
    WHERE user_id = ? 
    ORDER BY id DESC 
    LIMIT 1
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $currentTime = date("Y-m-d H:i:s");

    if ($row['otp_code'] !== $otp) {
        echo json_encode(["success" => false, "message" => "Invalid OTP"]);
        exit;
    }

    if ($currentTime > $row['expires_at']) {
        echo json_encode(["success" => false, "message" => "OTP has expired"]);
        exit;
    }

    // Optional: delete OTP after use
    $deleteStmt = $conn->prepare("DELETE FROM otp_codes WHERE id = ?");
    $deleteStmt->bind_param("i", $row['id']);
    $deleteStmt->execute();

    echo json_encode(["success" => true, "message" => "OTP verified successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid OTP"]);
}
