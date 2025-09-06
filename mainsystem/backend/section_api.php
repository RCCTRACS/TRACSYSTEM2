<?php
// section_api.php
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

        $sql = "SELECT id, section, type, created_at FROM sections WHERE 1";

        if ($search !== "") {
            $safe = $conn->real_escape_string($search);
            $sql .= " AND (section LIKE '%$safe%' OR type LIKE '%$safe%')";
        }

        if ($filterType !== "" && $filterType !== "All") {
            $ft = $conn->real_escape_string($filterType);
            $sql .= " AND type = '$ft'";
        }

        $sql .= " ORDER BY section ASC";

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
            header("Content-Disposition: attachment; filename=\"sections_export_{$timestamp}.csv\"");
            // Output CSV header:
            echo "id,section,type,created_at\n";
            foreach ($rows as $r) {
                $line = [
                    csv_escape($r['id']),
                    csv_escape($r['section']),
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

        // Detect bulk input: either { "bulk": [ ... ] } or raw array [ ... ]
        $bulkRows = [];
        if (isset($data['bulk']) && is_array($data['bulk'])) {
            $bulkRows = $data['bulk'];
        } elseif (is_array($data) && array_values($data) === $data) {
            // numeric-indexed array
            $bulkRows = $data;
        }

        if (!empty($bulkRows)) {
            $inserted = 0;
            $skipped = 0;
            $insertedRows = [];

            // Use transaction for bulk
            $conn->begin_transaction();

            $stmtCheck = $conn->prepare("SELECT id FROM sections WHERE section = ?");
            $stmtInsert = $conn->prepare("INSERT INTO sections (section, type) VALUES (?, ?)");

            foreach ($bulkRows as $row) {
                // allow different key casings (Section / section)
                $sectionName = trim($row['section'] ?? $row['Section'] ?? '');
                $type = trim($row['type'] ?? $row['Type'] ?? '');

                if ($sectionName === '') {
                    $skipped++;
                    continue;
                }
                if ($type === '') $type = 'Regular';

                // duplicate check by section name
                $stmtCheck->bind_param("s", $sectionName);
                $stmtCheck->execute();
                $stmtCheck->store_result();
                if ($stmtCheck->num_rows > 0) {
                    $skipped++;
                    continue;
                }

                // insert
                $stmtInsert->bind_param("ss", $sectionName, $type);
                if ($stmtInsert->execute()) {
                    $inserted++;
                    $insertedRows[] = [
                        "id" => $conn->insert_id,
                        "section" => $sectionName,
                        "type" => $type
                    ];
                } else {
                    // insertion failure — rollback and return error
                    $conn->rollback();
                    http_response_code(500);
                    echo json_encode(["error" => $conn->error]);
                    exit();
                }
            }

            $conn->commit();
            // close statements
            $stmtCheck->close();
            $stmtInsert->close();

            echo json_encode([
                "success" => true,
                "inserted" => $inserted,
                "skipped" => $skipped,
                "rows" => $insertedRows,
                "message" => "$inserted sections inserted, $skipped skipped."
            ]);
            exit();
        }

        // Single insert path (expects { "section":"7 - Apple", "type":"Regular" })
        $sectionName = trim($data['section'] ?? $data['Section'] ?? '');
        $type = trim($data['type'] ?? $data['Type'] ?? '');
        if ($sectionName === '') {
            http_response_code(400);
            echo json_encode(["error" => "Missing section"]);
            exit();
        }
        if ($type === '') $type = 'Regular';

        // duplicate check
        $stmt = $conn->prepare("SELECT id FROM sections WHERE section = ?");
        $stmt->bind_param("s", $sectionName);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "Section already exists"]);
            exit();
        }

        $stmtIns = $conn->prepare("INSERT INTO sections (section, type) VALUES (?, ?)");
        $stmtIns->bind_param("ss", $sectionName, $type);
        if ($stmtIns->execute()) {
            echo json_encode([
                "success" => true,
                "id" => $conn->insert_id,
                "section" => $sectionName,
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
        $sectionName = trim($data['section'] ?? $data['Section'] ?? '');
        $type = trim($data['type'] ?? $data['Type'] ?? '');

        if ($id <= 0 || $sectionName === '') {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            exit();
        }
        if ($type === '') $type = 'Regular';

        // optional: check duplicate (another row with same section)
        $stmtDup = $conn->prepare("SELECT id FROM sections WHERE section = ? AND id <> ?");
        $stmtDup->bind_param("si", $sectionName, $id);
        $stmtDup->execute();
        $stmtDup->store_result();
        if ($stmtDup->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "Another section with same name exists"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE sections SET section = ?, type = ? WHERE id = ?");
        $stmt->bind_param("ssi", $sectionName, $type, $id);
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

        $stmt = $conn->prepare("DELETE FROM sections WHERE id = ?");
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

// close connection
$conn->close();
