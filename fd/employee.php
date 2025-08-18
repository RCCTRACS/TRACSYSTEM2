<html>

<head>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add new employee</title>

</head>
<style>
    body {
        background-color: #5AB2FF;
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

    form input[type="text"],
    form select {
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
        background-color: #FDDE55;
        color: black;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    p a:hover {
        background-color: #FEEFAD;
    }

    img {
        display: block;
        margin: 0 auto 20px;
        border-radius: 50%;
    }
</style>

<body>
    <img src="create.png" alt="create icon" width="150" height="150">
    <h1>Add New Employee</h1>
    <form action="employeeadd.php" method="POST">
        Employee Name: <input type="text" name="name"><br>
        Phone Number: <input type="text" name="number"><br>
        Department ID:
        <select name="department" required>
            <option value="" disabled selected>Select Department</option>
            <option value="1">CCS</option>
            <option value="2">CASED</option>
            <option value="3">CBA</option>
            <option value="4">COE</option>
            <option value="5">Masters</option>
        </select><br><br>
        <input type="submit">
    </form>
    <p><a href="index.php">Back to Home</a></p>
</body>

</html>