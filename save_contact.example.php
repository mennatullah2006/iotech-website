<?php
// ============================================================
//  TEMPLATE FILE — safe to upload to GitHub
//  Copy this file, rename it to save_contact.php,
//  and fill in YOUR real values below.
// ============================================================

// Database credentials — replace with your own values
$host = "YOUR_HOST";         // e.g. "127.0.0.1" or your server IP
$user = "YOUR_DB_USERNAME";  // e.g. "root"
$pass = "YOUR_DB_PASSWORD";  // e.g. "mySecretPassword"
$db   = "YOUR_DB_NAME";      // e.g. "iotech_contacts"
$port = 3306;                // e.g. 3306 or 3307

// Connect to the database
$conn = mysqli_connect($host, $user, $pass, $db, $port);

if (!$conn) {
    http_response_code(500);
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name     = $_POST["name"]           ?? "";
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
    ");

    mysqli_stmt_bind_param($stmt, "ssssssss", $date, $name, $phone, $email, $service, $location, $message, $contact);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

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
