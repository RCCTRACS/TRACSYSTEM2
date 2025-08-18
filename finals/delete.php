<html>
<title>Delete Record</title>
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
        background-color: #C40C0C;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    input[type="submit"]:hover {
        background-color: #A34343;
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
    <img src="delete.png" alt="delete icon" width="150" height="150">
    <h1>Delete Student Record</h1>

    <body>

        <body>

            <form id="deleteForm" action="delete_form.php" method="POST" onsubmit="return confirmDelete()">
                Input ID Number: <input type="text" name="id"><br>
                <input type="submit" value="Delete Record"><br><br>
            </form>
            <p><a href="home.php">Back to Home</a></p>

            <script>
                function confirmDelete() {
                    var confirmation = confirm("Are you sure you want to delete the record?");
                    return confirmation;
                }
            </script>
        </body>

</html>