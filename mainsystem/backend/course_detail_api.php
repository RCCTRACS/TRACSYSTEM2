<?php
// course_detail_api.php
require __DIR__ . "/../database/db_config.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// Read input (for POST, PUT, DELETE)
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

// ✅ GET: fetch students in course_detail
if ($method === 'GET') {
    $subject_code = $_GET['subject_code'] ?? null;
    $barcode_id   = $_GET['barcode_id'] ?? null;

    if ($subject_code && $barcode_id) {
        $stmt = $conn->prepare("SELECT * FROM course_detail WHERE subject_code = ? AND barcode_id = ?");
        $stmt->bind_param("ss", $subject_code, $barcode_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        echo json_encode($row ? ["success" => true, "student" => $row] : ["success" => false, "error" => "Student not found"]);
        $stmt->close();

    } elseif ($subject_code) {
        $stmt = $conn->prepare("SELECT * FROM course_detail WHERE subject_code = ? ORDER BY id DESC");
        $stmt->bind_param("s", $subject_code);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["success" => true, "data" => $data]);
        $stmt->close();

    } else {
        echo json_encode(["success" => false, "error" => "Missing subject_code"]);
    }
    exit();
}

// ✅ POST: add a student to a subject
if ($method === 'POST') {
    $subject_code = $input['subject_code'] ?? '';
    $barcode_id   = $input['barcode_id'] ?? '';
    $student_name = $input['student_name'] ?? '';
    $department   = $input['department'] ?? '';
    $year_level   = $input['year_level'] ?? '';
    $status       = $input['status'] ?? 'Absent';

    if ($subject_code && $barcode_id && $student_name) {
        $stmt = $conn->prepare("
            INSERT INTO course_detail (subject_code, barcode_id, student_name, department, year_level, status) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                student_name=VALUES(student_name),
                department=VALUES(department),
                year_level=VALUES(year_level),
                status=VALUES(status)
        ");
        $stmt->bind_param("ssssss", $subject_code, $barcode_id, $student_name, $department, $year_level, $status);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Student added/updated", "id" => $stmt->insert_id ?: null]);
        } else {
            echo json_encode(["success" => false, "error" => $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
    }
    exit();
}

// ✅ PUT: update student status (by id OR barcode_id+subject_code)
if ($method === 'PUT') {
    $id          = $input['id'] ?? null;
    $barcode_id  = $input['barcode_id'] ?? null;
    $subject_code = $input['subject_code'] ?? null;
    $status      = $input['status'] ?? null;

    if ($id && $status) {
        $stmt = $conn->prepare("UPDATE course_detail SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $id);

    } elseif ($barcode_id && $subject_code && $status) {
        $stmt = $conn->prepare("UPDATE course_detail SET status = ? WHERE barcode_id = ? AND subject_code = ?");
        $stmt->bind_param("sss", $status, $barcode_id, $subject_code);

    } else {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit();
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Status updated"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }
    $stmt->close();
    exit();
}

// ✅ DELETE: remove student from subject
if ($method === 'DELETE') {
    $id = $input['id'] ?? null;

    if ($id) {
        $stmt = $conn->prepare("DELETE FROM course_detail WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Student removed from course"]);
        } else {
            echo json_encode(["success" => false, "error" => $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "Missing id"]);
    }
    exit();
}

// ❌ Invalid method
http_response_code(405);
echo json_encode(["success" => false, "error" => "Invalid request method"]);
exit();
