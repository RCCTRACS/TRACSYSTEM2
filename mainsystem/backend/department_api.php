<?php
// department_api.php
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

// Escape CSV values
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
        $export = $_GET['export'] ?? "";

        $sql = "SELECT id, department, type, created_at FROM departments WHERE 1";

        if ($search !== "") {
            $sql .= " AND (department LIKE '%$search%' OR type LIKE '%$search%')";
        }
        if ($filterType !== "" && $filterType !== "All") {
            $sql .= " AND type = '$filterType'";
        }

        $sql .= " ORDER BY department ASC";

        $result = $conn->query($sql);
        $rows = [];
        if ($result) {
            while ($r = $result->fetch_assoc()) {
                $rows[] = $r;
            }
        }

        // CSV Export (template format)
        if ($export === "csv") {
            header("Content-Type: text/csv; charset=UTF-8");
            $timestamp = date("Y-m-d_H-i-s");
            header("Content-Disposition: attachment; filename=\"departments_template_{$timestamp}.csv\"");

            echo "department,type (Student|Employee)\n";
            foreach ($rows as $r) {
                echo csv_escape($r['department']) . "," . csv_escape($r['type']) . "\n";
            }
            exit();
        }

        echo json_encode($rows);
        break;

    case "POST":
        // Handle CSV bulk upload
        if (!empty($_FILES['file']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
            $fileTmp = $_FILES['file']['tmp_name'];
            $handle = fopen($fileTmp, "r");
            if ($handle === false) {
                http_response_code(400);
                echo json_encode(["error" => "Unable to read uploaded file"]);
                exit();
            }

            $header = fgetcsv($handle); // skip header row
            $inserted = 0;
            $updated = 0;
            $skipped = 0;

            while (($row = fgetcsv($handle)) !== false) {
                $departmentName = trim($row[0] ?? "");
                $type = trim($row[1] ?? "Student");

                if ($departmentName === "") {
                    $skipped++;
                    continue;
                }

                // Check if exists
                $stmt = $conn->prepare("SELECT id FROM departments WHERE department = ?");
                $stmt->bind_param("s", $departmentName);
                $stmt->execute();
                $res = $stmt->get_result();

                if ($res && $res->num_rows > 0) {
                    // Update if exists
                    $existing = $res->fetch_assoc();
                    $id = $existing['id'];
                    $stmtUpd = $conn->prepare("UPDATE departments SET type = ? WHERE id = ?");
                    $stmtUpd->bind_param("si", $type, $id);
                    if ($stmtUpd->execute()) $updated++;
                } else {
                    // Insert new
                    $stmtIns = $conn->prepare("INSERT INTO departments (department, type) VALUES (?, ?)");
                    $stmtIns->bind_param("ss", $departmentName, $type);
                    if ($stmtIns->execute()) $inserted++;
                }
            }
            fclose($handle);

            echo json_encode([
                "success" => true,
                "message" => "Bulk upload complete",
                "inserted" => $inserted,
                "updated" => $updated,
                "skipped" => $skipped
            ]);
            exit();
        }

        // Handle single JSON insert (normal)
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if ($data !== null) {
            $departmentName = trim($data['department'] ?? $data['Department'] ?? '');
            $type = trim($data['type'] ?? $data['Type'] ?? $data['type (Student|Employee)'] ?? '');

            if ($departmentName === '') {
                http_response_code(400);
                echo json_encode(["error" => "Missing department"]);
                exit();
            }
            if ($type === '') $type = 'Student';

            // Duplicate check
            $stmt = $conn->prepare("SELECT id FROM departments WHERE department = ?");
            $stmt->bind_param("s", $departmentName);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) {
                http_response_code(409);
                echo json_encode(["error" => "Department already exists"]);
                exit();
            }

            // Insert
            $stmtIns = $conn->prepare("INSERT INTO departments (department, type) VALUES (?, ?)");
            $stmtIns->bind_param("ss", $departmentName, $type);
            if ($stmtIns->execute()) {
                $newId = $conn->insert_id;
                $res = $conn->query("SELECT id, department, type, created_at FROM departments WHERE id = $newId");
                $row = $res->fetch_assoc();

                echo json_encode([
                    "success" => true,
                    "data" => $row
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => $conn->error]);
            }
            exit();
        }

        // If neither file nor JSON was provided
        http_response_code(400);
        echo json_encode(["error" => "No data provided"]);
        break;

    case "PUT":
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if ($data === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        $id = intval($data['id'] ?? 0);
        $departmentName = trim($data['department'] ?? '');
        $type = trim($data['type'] ?? $data['Type'] ?? $data['type (Student|Employee)'] ?? '');

        if ($id <= 0 || $departmentName === '') {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            exit();
        }
        if ($type === '') $type = 'Student';

        // Duplicate check
        $stmtDup = $conn->prepare("SELECT id FROM departments WHERE department = ? AND id <> ?");
        $stmtDup->bind_param("si", $departmentName, $id);
        $stmtDup->execute();
        $stmtDup->store_result();
        if ($stmtDup->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "Another department with same name exists"]);
            exit();
        }

        // Update
        $stmt = $conn->prepare("UPDATE departments SET department = ?, type = ? WHERE id = ?");
        $stmt->bind_param("ssi", $departmentName, $type, $id);
        if ($stmt->execute()) {
            $res = $conn->query("SELECT id, department, type, created_at FROM departments WHERE id = $id");
            $row = $res->fetch_assoc();

            echo json_encode([
                "success" => true,
                "data" => $row
            ]);
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

        $stmt = $conn->prepare("DELETE FROM departments WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "id" => $id]);
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
