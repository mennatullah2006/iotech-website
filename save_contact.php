<?php
//These are the credentials needed to connect to your MySQL database:
$host = "127.0.0.1";
$user = "root";//root means the admin
$pass = "";
$db   = "iotech_contacts";
$port = 3307;
//The result (the connection object) is stored in $conn 
$conn = mysqli_connect($host, $user, $pass, $db, $port);//is a built-in PHP function that opens a connection to the MySQL database using the 5 credentials above.

if (!$conn) {
    http_response_code(500);
    die("Connection failed: " . mysqli_connect_error());
}
//$_SERVER is a super-global array PHP automatically fills with info about the current HTTP request.
if ($_SERVER["REQUEST_METHOD"] == "POST") {//When someone clicks the Submit button on your form, the browser sends the data using something called POST.
                                           
    $name     = $_POST["name"]           ?? "";//ets the value from the form field whose name attribute is "name".
    //$_POST is a bag that holds everything the visitor typed in the form.
    $phone    = $_POST["phone"]          ?? "";
    $email    = $_POST["email"]          ?? "";
    $service  = $_POST["service"]        ?? "";
    $location = $_POST["location"]       ?? "";
    $message  = $_POST["message"]        ?? "";
    $contact  = $_POST["contact-method"] ?? "";
    $date     = date("Y-m-d H:i:s");

    if (empty($name) || empty($phone)) {
        http_response_code(400);
        die("Error: Name and Phone are required.");
    }

    $stmt = mysqli_prepare($conn, "
        INSERT INTO contacts (date, name, phone, email, service, location, message, contact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");// a PHP function that prepares a SQL query for safe execution. It takes two arguments:$conn — the database connectionThe SQL string with ? placeholders

    mysqli_stmt_bind_param($stmt, "ssssssss", $date, $name, $phone, $email, $service, $location, $message, $contact);
    mysqli_stmt_execute($stmt);//// Actually RUN the query → saves the row in DB
    mysqli_stmt_close($stmt);//// Clean up, we're done with it

    http_response_code(200);
    echo "success";
    exit();

} else {
    http_response_code(405);
    echo "Method not allowed";
    exit();
}

mysqli_close($conn);
?>
