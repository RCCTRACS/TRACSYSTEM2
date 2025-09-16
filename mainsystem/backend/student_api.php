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

// Detect request input (JSON or form-urlencoded)
$rawInput = file_get_contents("php://input");
$input = [];
if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $input = $decoded;
    } else {
        parse_str($rawInput, $input);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($input) && !empty($_POST)) {
    $input = $_POST;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        if (isset($_GET['barcode_id'])) {
            // Fetch student by barcode
            $stmt = $conn->prepare("SELECT * FROM students WHERE barcode_id = ?");
            $stmt->bind_param("s", $_GET['barcode_id']);
        } elseif (isset($_GET['search'])) {
            // Search students
            $search = "%" . $_GET['search'] . "%";
            $stmt = $conn->prepare("
                SELECT * FROM students
                WHERE barcode_id LIKE ? 
                   OR student_name LIKE ? 
                   OR department LIKE ? 
                   OR year_level LIKE ?
                ORDER BY created_at DESC
            ");
            $stmt->bind_param("ssss", $search, $search, $search, $search);
        } else {
            // Fetch all students
            $stmt = $conn->prepare("SELECT * FROM students ORDER BY created_at DESC");
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $students = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode(["success" => true, "data" => $students]);
        $stmt->close();
        break;

    case "POST":
        if (!isset($input['barcode_id'], $input['student_name'], $input['year_level'], $input['department'], $input['parent_email'])) {
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            break;
        }

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

        $barcode_id = $input['barcode_id'];

        $conn->begin_transaction();

        try {
            $stmt1 = $conn->prepare("DELETE FROM attendance WHERE barcode_id = ?");
            $stmt1->bind_param("s", $barcode_id);
            $stmt1->execute();
            $stmt1->close();

            $stmt2 = $conn->prepare("DELETE FROM students WHERE barcode_id = ?");
            $stmt2->bind_param("s", $barcode_id);
            $stmt2->execute();
            $stmt2->close();

            $conn->commit();
            echo json_encode(["success" => true, "message" => "Student and attendance deleted permanently"]);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Error deleting student: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
