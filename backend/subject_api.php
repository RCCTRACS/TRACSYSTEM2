<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

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

  // 🔹 GET all subjects
  case "GET":
    $sql = "SELECT * FROM subjects ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $subjects = [];

    if ($result) {
      while ($row = $result->fetch_assoc()) {
        $subjects[] = $row;
      }
      echo json_encode(["success" => true, "subjects" => $subjects]);
    } else {
      echo json_encode(["success" => false, "message" => $conn->error]);
    }
    break;

  // 🔹 POST - Add subject
  case "POST":
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data) {
      echo json_encode(["success" => false, "message" => "Invalid JSON"]);
      exit;
    }

    // Required only code, name, department, instructor
    if (empty($data["subject_code"]) || empty($data["subject_name"]) || empty($data["department"]) || empty($data["instructor"])) {
      echo json_encode(["success" => false, "message" => "Missing required fields"]);
      exit;
    }

    $subject_time = $data["subject_time"] ?? null;
    $grade        = $data["grade"] ?? null;
    $strand       = $data["strand"] ?? null;
    $section      = $data["section"] ?? null;

    $stmt = $conn->prepare("
      INSERT INTO subjects (subject_code, subject_name, subject_time, department, grade, strand, section, instructor, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    if (!$stmt) {
      echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
      exit;
    }

    $stmt->bind_param(
      "ssssssss",
      $data["subject_code"],
      $data["subject_name"],
      $subject_time,
      $data["department"],
      $grade,
      $strand,
      $section,
      $data["instructor"]
    );

    if ($stmt->execute()) {
      echo json_encode(["success" => true, "message" => "Subject added successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => "Insert failed: " . $stmt->error]);
    }
    $stmt->close();
    break;

  // 🔹 PUT - Update subject
  case "PUT":
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data || empty($data["subject_code"])) {
      echo json_encode(["success" => false, "message" => "Invalid JSON or missing subject_code"]);
      exit;
    }

    $subject_time = $data["subject_time"] ?? null;
    $grade        = $data["grade"] ?? null;
    $strand       = $data["strand"] ?? null;
    $section      = $data["section"] ?? null;

    $stmt = $conn->prepare("
      UPDATE subjects 
      SET subject_name=?, subject_time=?, department=?, grade=?, strand=?, section=?, instructor=? 
      WHERE subject_code=?
    ");

    if (!$stmt) {
      echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
      exit;
    }

    $stmt->bind_param(
      "ssssssss",
      $data["subject_name"],
      $subject_time,
      $data["department"],
      $grade,
      $strand,
      $section,
      $data["instructor"],
      $data["subject_code"]
    );

    if ($stmt->execute()) {
      echo json_encode(["success" => true, "message" => "Subject updated successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => "Update failed: " . $stmt->error]);
    }
    $stmt->close();
    break;

  // 🔹 DELETE - Remove subject
  case "DELETE":
    $code = $_GET["subject_code"] ?? "";
    if (empty($code)) {
      echo json_encode(["success" => false, "message" => "Subject code required"]);
      exit;
    }

    $stmt = $conn->prepare("DELETE FROM subjects WHERE subject_code=?");
    if (!$stmt) {
      echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
      exit;
    }

    $stmt->bind_param("s", $code);

    if ($stmt->execute()) {
      echo json_encode(["success" => true, "message" => "Subject deleted successfully"]);
    } else {
      echo json_encode(["success" => false, "message" => "Delete failed: " . $stmt->error]);
    }
    $stmt->close();
    break;

  default:
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}

$conn->close();
