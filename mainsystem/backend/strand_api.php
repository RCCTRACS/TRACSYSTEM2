<?php
require __DIR__ . "/../database/db_config.php";

// ✅ CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER["REQUEST_METHOD"];

// ✅ Handle preflight request
if ($method === "OPTIONS") {
    http_response_code(200);
    exit();
}

switch ($method) {
    case "GET":
        // --- Search & Filter ---
        $search = isset($_GET["search"]) ? $conn->real_escape_string($_GET["search"]) : "";
        $filter = isset($_GET["filter"]) ? $conn->real_escape_string($_GET["filter"]) : "";

        $sql = "SELECT * FROM strands WHERE 1";

        if (!empty($search)) {
            $sql .= " AND (strand LIKE '%$search%' OR type LIKE '%$search%')";
        }
        if (!empty($filter) && $filter !== "All") {
            $sql .= " AND type = '$filter'";
        }

        $result = $conn->query($sql);
        $rows = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
        }

        echo json_encode($rows);
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        // --- Bulk Upload ---
        $bulkRows = [];
        if (isset($data["bulk"]) && is_array($data["bulk"])) {
            $bulkRows = $data["bulk"];
        } elseif (array_keys($data) === range(0, count($data) - 1)) {
            $bulkRows = $data;
        }

        if (!empty($bulkRows)) {
            $inserted = 0;
            $skipped  = 0;
            $insertedRows = [];

            $stmtCheck  = $conn->prepare("SELECT id FROM strands WHERE strand = ? AND type = ?");
            $stmtInsert = $conn->prepare("INSERT INTO strands (strand, type) VALUES (?, ?)");

            foreach ($bulkRows as $row) {
                $strand = trim($row["strand"] ?? "");
                $type   = trim($row["type"] ?? "");

                if ($strand === "" || $type === "") {
                    $skipped++;
                    continue;
                }

                // ✅ Check duplicate
                $stmtCheck->bind_param("ss", $strand, $type);
                $stmtCheck->execute();
                $stmtCheck->store_result();

                if ($stmtCheck->num_rows > 0) {
                    $skipped++;
                    continue;
                }

                // ✅ Insert
                $stmtInsert->bind_param("ss", $strand, $type);
                if ($stmtInsert->execute()) {
                    $inserted++;
                    $insertedRows[] = [
                        "id"     => $conn->insert_id,
                        "strand" => $strand,
                        "type"   => $type
                    ];
                }
            }

            echo json_encode([
                "success"  => true,
                "inserted" => $inserted,
                "skipped"  => $skipped,
                "rows"     => $insertedRows,
                "message"  => "$inserted strands inserted, $skipped skipped."
            ]);
            exit(); // 🚨 prevent single insert code from running
        }

        // --- Single Add Strand ---
        $strand = trim($data["strand"] ?? "");
        $type   = trim($data["type"] ?? "");

        if ($strand === "" || $type === "") {
            http_response_code(400);
            echo json_encode(["error" => "Missing strand or type"]);
            exit();
        }

        // ✅ Prevent duplicate
        $stmtCheck = $conn->prepare("SELECT id FROM strands WHERE strand = ? AND type = ?");
        $stmtCheck->bind_param("ss", $strand, $type);
        $stmtCheck->execute();
        $stmtCheck->store_result();

        if ($stmtCheck->num_rows > 0) {
            http_response_code(409); // Conflict
            echo json_encode(["error" => "Strand already exists"]);
            exit();
        }

        $stmt = $conn->prepare("INSERT INTO strands (strand, type) VALUES (?, ?)");
        $stmt->bind_param("ss", $strand, $type);
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "id"      => $conn->insert_id,
                "strand"  => $strand,
                "type"    => $type
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case "PUT":
        // --- Update Strand ---
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        $id     = intval($data["id"] ?? 0);
        $strand = trim($data["strand"] ?? "");
        $type   = trim($data["type"] ?? "");

        if ($id <= 0 || $strand === "" || $type === "") {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE strands SET strand=?, type=? WHERE id=?");
        $stmt->bind_param("ssi", $strand, $type, $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case "DELETE":
        // --- Delete Strand ---
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit();
        }

        $id = intval($data["id"] ?? 0);

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Missing id"]);
            exit();
        }

        $stmt = $conn->prepare("DELETE FROM strands WHERE id=?");
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
