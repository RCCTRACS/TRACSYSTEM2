<?php
require __DIR__ . "/../database/db_config.php";
header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "GET":
        if (isset($_GET["id"])) {
            $id = intval($_GET["id"]);
            $stmt = $conn->prepare("SELECT * FROM grades WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_assoc());
        } else {
            $result = $conn->query("SELECT * FROM grades ORDER BY id ASC");
            $rows = [];
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            echo json_encode($rows);
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["grade"])) {
            http_response_code(400);
            echo json_encode(["error" => "Grade is required"]);
            exit;
        }

        $grade = $data["grade"];
        $type = "Student";

        $stmt = $conn->prepare("INSERT INTO grades (grade, type) VALUES (?, ?)");
        $stmt->bind_param("ss", $grade, $type);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "id" => $stmt->insert_id]);
        } else {
            echo json_encode(["error" => $stmt->error]);
        }
        break;

    case "PUT":
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["id"], $data["grade"])) {
            http_response_code(400);
            echo json_encode(["error" => "ID and grade required"]);
            exit;
        }

        $id = intval($data["id"]);
        $grade = $data["grade"];
        $type = "Student";

        $stmt = $conn->prepare("UPDATE grades SET grade = ?, type = ? WHERE id = ?");
        $stmt->bind_param("ssi", $grade, $type, $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => $stmt->error]);
        }
        break;

    case "DELETE":
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data["id"])) {
            http_response_code(400);
            echo json_encode(["error" => "ID required"]);
            exit;
        }

        $id = intval($data["id"]);
        $stmt = $conn->prepare("DELETE FROM grades WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => $stmt->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
?>
