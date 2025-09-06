<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "trac_system";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
  case "GET":
    if (isset($_GET["resource"]) && $_GET["resource"] === "departments") {
      $result = $conn->query("SELECT id, department, type FROM departments ORDER BY department");
      $departments = [];
      while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
      }
      echo json_encode(["success" => true, "departments" => $departments]);
      break;
    }

    if (isset($_GET["resource"]) && $_GET["resource"] === "grades") {
      $result = $conn->query("SELECT id, grade_name, type FROM grades ORDER BY id");
      $grades = [];
      while ($row = $result->fetch_assoc()) {
        $grades[] = $row;
      }
      echo json_encode(["success" => true, "grades" => $grades]);
      break;
    }

    $result = $conn->query("SELECT id, first_name, last_name, email, department, level, role, status, created_at FROM users");
    $users = [];
    while ($row = $result->fetch_assoc()) {
      $users[] = $row;
    }
    echo json_encode(["success" => true, "users" => $users]);
    break;

  case "POST":
    $data = json_decode(file_get_contents("php://input"), true);
    $first_name = $conn->real_escape_string($data["first_name"]);
    $last_name  = $conn->real_escape_string($data["last_name"]);
    $email      = $conn->real_escape_string($data["email"]);
    $password_hash = password_hash($data["password"], PASSWORD_BCRYPT);
    $department = $conn->real_escape_string($data["department"]);
    $level      = $conn->real_escape_string($data["level"]);
    $role       = $conn->real_escape_string($data["role"]);
    $status     = $conn->real_escape_string($data["status"]);

    $sql = "INSERT INTO users (first_name, last_name, email, password_hash, department, level, role, status)
            VALUES ('$first_name', '$last_name', '$email', '$password_hash', '$department', '$level', '$role', '$status')";

    if ($conn->query($sql) === TRUE) {
      $id = $conn->insert_id;
      $res = $conn->query("SELECT id, first_name, last_name, email, department, level, role, status, created_at FROM users WHERE id=$id");
      $user = $res->fetch_assoc();
      echo json_encode(["success" => true, "user" => $user]);
    } else {
      echo json_encode(["success" => false, "message" => $conn->error]);
    }
    break;

  case "PUT":
    $data = json_decode(file_get_contents("php://input"), true);
    $id         = intval($data["id"]);
    $first_name = $conn->real_escape_string($data["first_name"]);
    $last_name  = $conn->real_escape_string($data["last_name"]);
    $email      = $conn->real_escape_string($data["email"]);
    $department = $conn->real_escape_string($data["department"]);
    $level      = $conn->real_escape_string($data["level"]);
    $role       = $conn->real_escape_string($data["role"]);
    $status     = $conn->real_escape_string($data["status"]);

    $update = "UPDATE users 
               SET first_name='$first_name', last_name='$last_name', email='$email',
                   department='$department', level='$level', role='$role', status='$status'
               WHERE id=$id";

    if ($conn->query($update) === TRUE) {
      $res = $conn->query("SELECT id, first_name, last_name, email, department, level, role, status, created_at FROM users WHERE id=$id");
      $user = $res->fetch_assoc();
      echo json_encode(["success" => true, "user" => $user]);
    } else {
      echo json_encode(["success" => false, "message" => $conn->error]);
    }
    break;

  case "DELETE":
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data["id"]);
    $sql = "DELETE FROM users WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
      echo json_encode(["success" => true, "message" => "User deleted successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => $conn->error]);
    }
    break;

  default:
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}

$conn->close();
