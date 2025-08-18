<html>

<head>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create New Record</title>

</head>
<style>
    body {
        background-color: #F8C794;
        font-family: Verdana;
    }

    h1,
    form,
    p,
    p a,
    p a:hover {
        text-align: center;
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
    <img src="create.png" alt="create icon" width="150" height="150">
    <h1>Create New Student Record</h1>
    <form action="student_info.php" method="POST">
        Student Name: <input type="text" name="name"><br>
        Age: <input type="text" name="age"><br>
        Grade: <input type="text" name="grade"><br><br>
        <input type="submit">
    </form>
    <p><a href="home.php">Back to Home</a></p>
</body>

</html>