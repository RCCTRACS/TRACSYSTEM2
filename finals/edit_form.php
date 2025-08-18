<html>
<style>
    body {
        background-color: #F8C794;
        font-family: Verdana;
        text-align: center;
        margin-bottom: 20px;
    }

    p,
    p a,
    p a:hover,
    {
    text-align: center;
    }

    input[type="submit"]:hover {
        background-color: #45a049;
    }

    p {
        text-align: center;
        margin-bottom: 10px;
    }

    p a {
        display: inline-block;
        padding: 10px;
        width: 200px;
        background-color: #AF8260;
        color: black;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    p a:hover {
        background-color: #F7DCB9;
    }

    table {
        width: 80%;
        margin: 20px auto;
        border-collapse: collapse;

    }

    table,
    th,
    td {
        border: 1px solid black;
        padding: 10px;
        text-align: center, left;
    }

    th {
        background-color: #AF8260;
        color: white;
    }

    tr:nth-child(even) {
        background-color: #F7DCB9;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    form input[type="text"] {
        width: 250px;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    input[type="submit"] {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    input[type="submit"]:hover {
        background-color: #45a049;
    }

    img {
        display: block;
        margin: 0 auto 20px;
        border-radius: 50%;
    }
</style>

<head>
    <title>Edit Student Record</title>
</head>

<body>
    <img src="student.png" alt="student icon" width="150" height="150">
    <?php
    $id = $_POST["id"];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "student_records";


    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT id, name, age, grade FROM students WHERE id = '$id'";
    $result = $conn->query($sql);
    echo "<h2>STUDENT INFORMATION</h2>";
    if ($result->num_rows > 0) {
        echo "<table>";
        echo "<tr><th>Student ID</th><th>Student Name</th><th>Student Age</th><th>Student Grade</th></tr>";

        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row["id"] . "</td>";
            echo "<td>" . $row["name"] . "</td>";
            echo "<td>" . $row["age"] . "</td>";
            echo "<td>" . $row["grade"] . "</td>";
            echo "</tr>";
        }

        echo "</table>";
    } else {
        echo "0 results";
    }

    $conn->close();
    ?>
    <form action="update.php" method="POST">
        ID Number: <input type="text" name="id"><br>
        Student Name: <input type="text" name="name"><br>
        Age: <input type="text" name="age"><br>
        Grade: <input type="text" name="grade"><br>
        <input type="submit">
    </form>
    <p><a href="edit.php">Edit Another Record</a></p>
    <p><a href="home.php">Back to Home</a></p>

</body>

</html>