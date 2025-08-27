<?php
// Enable error reporting (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// DB connection
$host = "localhost";
$dbname = "trac_system";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Read JSON input
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Validate input
if (empty($data['email']) || empty($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit();
}

$email = trim($data['email']);
$plainPass = $data['password'];

// Check if email already exists
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit();
}
$checkStmt->close();

// Hash password
$passHash = password_hash($plainPass, PASSWORD_DEFAULT);

// Insert into DB
$stmt = $conn->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $passHash);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to register user"]);
}

$stmt->close();
$conn->close();
?>
