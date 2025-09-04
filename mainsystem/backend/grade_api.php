<?php
// grade_api.php
require __DIR__ . "/../database/db_config.php";

// CORS / headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

// Preflight
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function csv_escape($val) {
    $val = (string)$val;
    if (strpos($val, '"') !== false) {
        $val = str_replace('"', '""', $val);
    }
    if (strpos($val, ',') !== false || strpos($val, "\n") !== false || strpos($val, '"') !== false) {
        return "\"$val\"";
    }
    return $val;
}

switch ($method) {
    case "GET":
        $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : "";
        $filterType = isset($_GET['filterType']) ? $conn->real_escape_string($_GET['filterType']) : "";
        $export = isset($_GET['export']) ? $_GET['export'] : "";

        $sql = "SELECT id, grade_name, type, created_at FROM grades WHERE 1";

        if ($search !== "") {
            $safe = $conn->real_escape_string($search);
            $sql .= " AND (grade_name LIKE '%$safe%' OR type LIKE '%$safe%')";
        }

        if ($filterType !== "" && $filterType !== "All") {
            $ft = $conn->real_escape_string($filterType);
            $sql .= " AND type = '$ft'";
        }

        $sql .= " ORDER BY grade_name ASC";

        $result = $conn->query($sql);
        $rows = [];
        if ($result) {
            while ($r = $result->fetch_assoc()) {
                $rows[] = $r;
            }
        }

        // Export CSV path
        if ($export === "csv") {
            header("Content-Type: text/csv; charset=UTF-8");
            $timestamp = date("Y-m-d_H-i-s");
            header("Content-Disposition: attachment; filename=\"grades_export_{$timestamp}.csv\"");
            echo "id,grade_name,type,created_at\n";
            foreach ($rows as $r) {
                $line = [
                    csv_escape($r['id']),
                    csv_escape($r['grade_name']),
                    csv_escape($r['type']),
                    csv_escape($r['created_at'])
                ];
                echo implode(",", $line) . "\n";
            }
            exit();
        }

        echo json_encode($rows);
        break;

    case "POST":
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if ($data === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        $gradeName = trim($data['grade_name'] ?? $data['Grade_name'] ?? '');
        $type = trim($data['type'] ?? $data['Type'] ?? '');

        if ($gradeName === '') {
            http_response_code(400);
            echo json_encode(["error" => "Missing grade_name"]);
            exit();
        }
        if ($type === '') $type = 'General';

        // duplicate check
        $stmt = $conn->prepare("SELECT id FROM grades WHERE grade_name = ?");
        $stmt->bind_param("s", $gradeName);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "Grade already exists"]);
            exit();
        }

        $stmtIns = $conn->prepare("INSERT INTO grades (grade_name, type) VALUES (?, ?)");
        $stmtIns->bind_param("ss", $gradeName, $type);
        if ($stmtIns->execute()) {
            echo json_encode([
                "success" => true,
                "id" => $conn->insert_id,
                "grade_name" => $gradeName,
                "type" => $type
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case "PUT":
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);
        if ($data === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        $id = intval($data['id'] ?? $_GET['id'] ?? 0);
        $gradeName = trim($data['grade_name'] ?? $data['Grade_name'] ?? '');
        $type = trim($data['type'] ?? $data['Type'] ?? '');

        if ($id <= 0 || $gradeName === '') {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            exit();
        }
        if ($type === '') $type = 'General';

        // check duplicate
        $stmtDup = $conn->prepare("SELECT id FROM grades WHERE grade_name = ? AND id <> ?");
        $stmtDup->bind_param("si", $gradeName, $id);
        $stmtDup->execute();
        $stmtDup->store_result();
        if ($stmtDup->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "Another grade with same name exists"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE grades SET grade_name = ?, type = ? WHERE id = ?");
        $stmt->bind_param("ssi", $gradeName, $type, $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case "DELETE":
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);
        $id = intval($data['id'] ?? $_GET['id'] ?? 0);

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Missing id"]);
            exit();
        }

        $stmt = $conn->prepare("DELETE FROM grades WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

$conn->close();
