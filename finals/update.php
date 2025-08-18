<html>
<title>Update Success!</title>
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

    img {
        display: block;
        margin: 0 auto 20px;
        border-radius: 50%;
    }
</style>

<body>
    <img src="success.png" alt="success icon" width="150" height="150">
    <?php
    $id = $_POST["id"];
    $name = $_POST["name"];
    $age = $_POST["age"];
    $grade = $_POST["grade"];

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

    $sql = "UPDATE students SET name = '$name', age = $age, grade = '$grade' WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }


    $conn->close();
    ?>
    <p><a href="home.php">Back to Home</a></p>
    <p><a href="edit.php">Edit Another Record</a></p>
</body>

</html>