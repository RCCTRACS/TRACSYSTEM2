<?php
// student_api.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight (OPTIONS request for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database config
require __DIR__ . "/../database/db_config.php";

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case "GET":
        if (isset($_GET['barcode_id'])) {
            $stmt = $conn->prepare("SELECT * FROM students WHERE barcode_id = ?");
            $stmt->bind_param("s", $_GET['barcode_id']);
        } else {
            $stmt = $conn->prepare("SELECT * FROM students ORDER BY created_at DESC");
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $students = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode(["success" => true, "data" => $students]);
        $stmt->close();
        break;

    case "POST":
        // Validate required fields
        if (!isset($input['barcode_id'], $input['student_name'], $input['year_level'], $input['department'], $input['parent_email'])) {
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            break;
        }

        // Use INSERT ... ON DUPLICATE KEY UPDATE to avoid duplicate errors
        $stmt = $conn->prepare("
            INSERT INTO students (barcode_id, student_name, year_level, department, parent_email) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            student_name=VALUES(student_name),
            year_level=VALUES(year_level),
            department=VALUES(department),
            parent_email=VALUES(parent_email)
        ");

        $stmt->bind_param(
            "sssss",
            $input['barcode_id'],
            $input['student_name'],
            $input['year_level'],
            $input['department'],
            $input['parent_email']
        );

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Student added/updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => $stmt->error]);
        }
        $stmt->close();
        break;

    case "PUT":
        if (!isset($input['barcode_id'])) {
            echo json_encode(["success" => false, "message" => "barcode_id is required"]);
            break;
        }

        $stmt = $conn->prepare("
            UPDATE students 
            SET student_name=?, year_level=?, department=?, parent_email=? 
            WHERE barcode_id=?
        ");
        $stmt->bind_param(
            "sssss",
            $input['student_name'],
            $input['year_level'],
            $input['department'],
            $input['parent_email'],
            $input['barcode_id']
        );

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Student updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => $stmt->error]);
        }
        $stmt->close();
        break;

    case "DELETE":
        if (!isset($input['barcode_id'])) {
            echo json_encode(["success" => false, "message" => "barcode_id is required"]);
            break;
        }

        $stmt = $conn->prepare("DELETE FROM students WHERE barcode_id = ?");
        $stmt->bind_param("s", $input['barcode_id']);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Student deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
