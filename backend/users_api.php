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
  echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
  exit;
}

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
  // 🔹 GET: users, departments, grades
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

    // Default: return all users
    $result = $conn->query("SELECT id, first_name, last_name, email, department, role, status, created_at FROM users ORDER BY id DESC");
    $users = [];
    while ($row = $result->fetch_assoc()) {
      $users[] = $row;
    }
    echo json_encode(["success" => true, "users" => $users]);
    break;

    // 🔹 POST: create user(s)
  case "POST":
    $data = json_decode(file_get_contents("php://input"), true);

    // If data is an array -> Bulk Upload
    if (isset($data[0]) && is_array($data[0])) {
      $inserted = [];
      foreach ($data as $row) {
        if (empty($row["first_name"]) || empty($row["last_name"]) || empty($row["email"])) {
          continue; // skip invalid row
        }

        $password = !empty($row["password"]) ? $row["password"] : "123456";
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password_hash, department, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
          "sssssss",
          $row["first_name"],
          $row["last_name"],
          $row["email"],
          $password_hash,
          $row["department"],
          $row["role"],
          $row["status"]
        );

        if ($stmt->execute()) {
          $id = $stmt->insert_id;
          $res = $conn->query("SELECT id, first_name, last_name, email, department, role, status, created_at FROM users WHERE id=$id");
          $user = $res->fetch_assoc();
          $inserted[] = $user;
        }
      }
      echo json_encode(["success" => true, "users" => $inserted]);
      break;
    }

    // Otherwise -> Single user
    if (empty($data["first_name"]) || empty($data["last_name"]) || empty($data["email"])) {
      echo json_encode(["success" => false, "message" => "Missing required fields"]);
      exit;
    }

    $password = !empty($data["password"]) ? $data["password"] : "123456";
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password_hash, department, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
      "sssssss",
      $data["first_name"],
      $data["last_name"],
      $data["email"],
      $password_hash,
      $data["department"],
      $data["role"],
      $data["status"]
    );

    if ($stmt->execute()) {
      $id = $stmt->insert_id;
      $res = $conn->query("SELECT id, first_name, last_name, email, department, role, status, created_at FROM users WHERE id=$id");
      $user = $res->fetch_assoc();
      echo json_encode(["success" => true, "user" => $user]);
    } else {
      echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    break;

  // 🔹 PUT: update user
  case "PUT":
    $data = json_decode(file_get_contents("php://input"), true);
    if (empty($data["id"])) {
      echo json_encode(["success" => false, "message" => "User ID required"]);
      exit;
    }

    $id = intval($data["id"]);

    $update = "UPDATE users SET first_name=?, last_name=?, email=?, department=?, role=?, status=?";
    $params = [
      $data["first_name"],
      $data["last_name"],
      $data["email"],
      $data["department"],
      $data["role"],
      $data["status"]
    ];
    $types = "ssssss";

    if (!empty($data["password"])) {
      $password_hash = password_hash($data["password"], PASSWORD_BCRYPT);
      $update .= ", password_hash=?";
      $params[] = $password_hash;
      $types .= "s";
    }

    $update .= " WHERE id=?";
    $params[] = $id;
    $types .= "i";

    $stmt = $conn->prepare($update);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
      $res = $conn->query("SELECT id, first_name, last_name, email, department, role, status, created_at FROM users WHERE id=$id");
      $user = $res->fetch_assoc();
      echo json_encode(["success" => true, "user" => $user]);
    } else {
      echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    break;

  // 🔹 DELETE: remove user
  case "DELETE":
    $id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;
    if ($id <= 0) {
      echo json_encode(["success" => false, "message" => "User ID required"]);
      exit;
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      echo json_encode(["success" => true, "message" => "User deleted successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    break;

  default:
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}

$conn->close();
