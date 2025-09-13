<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// 🔹 DB connection
$host = "localhost";
$dbname = "trac_system";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

// 🔹 Get JSON request
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing email or password"
    ]);
    exit();
}

$email = strtolower(trim($data['email']));
$passwordInput = $data['password'];

// 🔹 Prepare query
$stmt = $conn->prepare("SELECT id, first_name, last_name, password_hash, role, status 
                        FROM users 
                        WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    // 🔹 Check account status
    if ($user['status'] !== "Active") {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Account is inactive. Please contact admin."
        ]);
    } 
    // 🔹 Check password
    elseif (password_verify($passwordInput, $user['password_hash'])) {
        http_response_code(200);
        echo json_encode([
            "success"    => true,
            "message"    => "Login successful",
            "userId"     => $user['id'],
            "role"       => $user['role'],
            "first_name" => $user['first_name'],
            "last_name"  => $user['last_name'],
            "full_name"  => $user['first_name'] . " " . $user['last_name']
        ]);
    } 
    else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid password"
        ]);
    }
} else {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
}

$stmt->close();
$conn->close();
