<?php
$host = "localhost";      // Usually localhost in XAMPP
$user = "root";           // Default XAMPP MySQL user
$pass = "";               // Default XAMPP MySQL password is empty
$dbname = "trac_system";   // Database name (we'll create it next)

$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}
?>
