<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RCC AIMS</title>

    <style>
        body {
            background-color: #F8C794;
            font-family: Verdana, Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            margin-bottom: 20px;
        }

        li {
            list-style: none;
            margin-bottom: 10px;
        }

        li a {
            display: inline-block;
            width: 200px;
            padding: 10px;
            background-color: #AF8260;
            color: black;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        li a:hover {
            background-color: #F7DCB9;
        }

        img {
            display: block;
            margin: 0 auto 20px;
            border-radius: 50%;
        }
    </style>
</head>

<body>
    <img src="logo.png" alt="logo icon" width="150" height="150">
    <h1>Welcome to Academic Information Management System</h1>
    <p>Please select an option:</p>

    <ul>
        <li><a href="input_form.php">Create New Record</a></li>
        <li><a href="view.php">Search Record</a></li>
        <li><a href="edit.php">Update Record</a></li>
        <li><a href="delete.php">Delete Record</a></li>
    </ul>
</body>

</html>