<?php
// Enable error reporting (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// DB connection
$host = "localhost";
$dbname = "trac_system";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed", "error" => $conn->connect_error]);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['email']) || empty($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit();
}

$email = strtolower(trim($data['email']));
$passwordInput = $data['password'];

// Check user
$stmt = $conn->prepare("SELECT id, first_name, last_name, password_hash, role, status FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if ($user['status'] !== "active") {
        echo json_encode(["success" => false, "message" => "Account is inactive"]);
    } elseif (password_verify($passwordInput, $user['password_hash'])) {
        echo json_encode([
            "success"    => true,
            "message"    => "Login successful",
            "userId"     => $user['id'],
            "role"       => $user['role'],
            "first_name" => $user['first_name'],
            "last_name"  => $user['last_name']
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
