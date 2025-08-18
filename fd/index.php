<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MRMSRCC</title>

    <style>
        body {
            background-color: #5AB2FF;
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

        ul {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 0;
            list-style: none;
            max-width: 400px;
            margin: 0 auto;
        }

        li {
            margin-bottom: 10px;
        }

        li a {
            display: inline-block;
            width: 100%;
            padding: 10px;
            background-color: #FDDE55;
            color: black;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
            box-sizing: border-box;
        }

        li a:hover {
            background-color: #FEEFAD;
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
    <h1>Welcome to Maintenance Report Management System</h1>
    <p>Please select an option:</p>

    <ul>
        <li><a href="employee.php">Add New Employee</a></li>
        <li><a href="view.php">Create Report</a></li>
        <li><a href="edit.php">View Report</a></li>
        <li><a href="delete.php">Report Status</a></li>
    </ul>
</body>

</html>
