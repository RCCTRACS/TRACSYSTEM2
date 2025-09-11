<?php
require __DIR__ . "/../database/db_config.php";

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"];

// Preflight
if ($method === "OPTIONS") {
  http_response_code(200);
  exit();
}

switch ($method) {
  // 🔹 GET all subjects + metadata
  case "GET":
    // Fetch subjects
    $sql = "SELECT 
              s.id,
              s.code,
              s.name,
              s.time,
              g.grade_name AS grade,
              d.department_name AS department,
              u.first_name,
              u.last_name,
              u.email
            FROM subjects s
            LEFT JOIN grades g ON s.grade_id = g.id
            LEFT JOIN departments d ON s.department_id = d.id
            LEFT JOIN users u ON s.teacher_id = u.id
            ORDER BY s.name ASC";
    $result = $conn->query($sql);

    $subjects = [];
    while ($row = $result->fetch_assoc()) {
      $subjects[] = [
        "id" => $row["id"],
        "code" => $row["code"],
        "name" => $row["name"],
        "grade" => $row["grade"],
        "department" => $row["department"],
        "instructor" => trim($row["first_name"] . " " . $row["last_name"]),
        "instructor_email" => $row["email"],
        "time" => $row["time"]
      ];
    }

    // Fetch departments
    $departments = [];
    $deptRes = $conn->query("SELECT id, department_name FROM departments ORDER BY department_name ASC");
    while ($row = $deptRes->fetch_assoc()) {
      $departments[] = [
        "id" => $row["id"],
        "name" => $row["department_name"]
      ];
    }

    // Fetch grades
    $grades = [];
    $gradeRes = $conn->query("SELECT id, grade_name FROM grades ORDER BY grade_name ASC");
    while ($row = $gradeRes->fetch_assoc()) {
      $grades[] = [
        "id" => $row["id"],
        "name" => $row["grade_name"]
      ];
    }

    // Fetch teachers
    $teachers = [];
    $teacherRes = $conn->query("SELECT id, first_name, last_name, email FROM users WHERE role='teacher' ORDER BY first_name ASC");
    while ($row = $teacherRes->fetch_assoc()) {
      $teachers[] = [
        "id" => $row["id"],
        "first_name" => $row["first_name"],
        "last_name" => $row["last_name"],
        "email" => $row["email"]
      ];
    }

    echo json_encode([
      "success" => true,
      "subjects" => $subjects,
      "departments" => $departments,
      "grades" => $grades,
      "teachers" => $teachers
    ]);
    break;

  // 🔹 POST new subject
  case "POST":
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data["code"]) || empty($data["name"]) || empty($data["department_id"])) {
      echo json_encode(["success" => false, "message" => "Missing required fields"]);
      exit;
    }

    $stmt = $conn->prepare(
      "INSERT INTO subjects (code, name, department_id, grade_id, teacher_id, time) VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
      "ssiiis",
      $data["code"],
      $data["name"],
      $data["department_id"],
      $data["grade_id"],
      $data["teacher_id"],
      $data["time"]
    );

    if ($stmt->execute()) {
      echo json_encode(["success" => true, "message" => "Subject added successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    break;

  // 🔹 PUT update subject
  case "PUT":
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data["id"])) {
      echo json_encode(["success" => false, "message" => "Subject ID required"]);
      exit;
    }

    $stmt = $conn->prepare(
      "UPDATE subjects SET code=?, name=?, department_id=?, grade_id=?, teacher_id=?, time=? WHERE id=?"
    );
    $stmt->bind_param(
      "ssiiisi",
      $data["code"],
      $data["name"],
      $data["department_id"],
      $data["grade_id"],
      $data["teacher_id"],
      $data["time"],
      $data["id"]
    );

    if ($stmt->execute()) {
      echo json_encode(["success" => true, "message" => "Subject updated successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    break;

  // 🔹 DELETE subject
  case "DELETE":
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data["id"] ?? ($_GET["id"] ?? "");

    if (empty($id)) {
      echo json_encode(["success" => false, "message" => "Subject ID required"]);
      exit;
    }

    $stmt = $conn->prepare("DELETE FROM subjects WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      echo json_encode(["success" => true, "message" => "Subject deleted successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    break;

  default:
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}

$conn->close();
