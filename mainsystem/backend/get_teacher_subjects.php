<?php
require __DIR__ . "/../database/db_config.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// ✅ Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// ✅ Ensure DB connection
if (!$conn || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

// ✅ Get teacher email from query string
$teacher_email = $_GET['email'] ?? null;
if (!$teacher_email) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Teacher email missing"
    ]);
    exit();
}

// ✅ Fetch teacher info
$stmt = $conn->prepare("
    SELECT id, first_name, last_name, email 
    FROM users 
    WHERE email = ? AND role = 'teacher'
");
$stmt->bind_param("s", $teacher_email);
$stmt->execute();
$result = $stmt->get_result();
$teacher = $result->fetch_assoc();
$stmt->close();

if (!$teacher) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Teacher not found"
    ]);
    exit();
}

// Build full name (matches subjects.instructor string)
$full_name = trim($teacher['first_name'] . ' ' . $teacher['last_name']);

// ✅ Fetch subjects by instructor full name
$stmt2 = $conn->prepare("
    SELECT subject_code, subject_name, subject_time, department, grade, strand, section
    FROM subjects 
    WHERE instructor = ? 
    ORDER BY created_at DESC
");
$stmt2->bind_param("s", $full_name);
$stmt2->execute();
$result2 = $stmt2->get_result();

$subjects = [];
while ($row = $result2->fetch_assoc()) {
    $subjects[] = [
        "subject_code" => $row["subject_code"],
        "subject_name" => $row["subject_name"],
        "subject_time" => $row["subject_time"],
        "department"   => $row["department"],
        "grade"        => $row["grade"],
        "strand"       => $row["strand"],
        "section"      => $row["section"]
    ];
}
$stmt2->close();
$conn->close();

// ✅ Send response
http_response_code(200);
echo json_encode([
    "success" => true,
    "teacher" => [
        "id"        => $teacher['id'],
        "firstName" => $teacher['first_name'],
        "lastName"  => $teacher['last_name'],
        "name"      => $full_name,   // ✅ full name for frontend
        "email"     => $teacher['email']
    ],
    "subjects" => $subjects
]);
