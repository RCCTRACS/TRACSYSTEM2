<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$dbname = "trac_system";
$username = "root"; // XAMPP default
$password = "";     // XAMPP default

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "DB connection failed."]));
}

// Get request body
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['email']) || empty($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit();
}

$email = $data['email'];
$passwordInput = $data['password'];

// Check user
$stmt = $conn->prepare("SELECT id, password_hash FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($passwordInput, $user['password_hash'])) {
        
        echo json_encode(["success" => true, "message" => "OTP sent to your email", "userId" => $user['id']]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
