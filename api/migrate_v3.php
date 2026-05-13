<?php
$host = "localhost";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=armessage_db;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $conn->exec("ALTER TABLE user_platforms ADD COLUMN bot_scope VARCHAR(50) DEFAULT 'all' AFTER access_token");
    echo "Kolumna 'bot_scope' dodana.";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "Kolumna 'bot_scope' już istnieje.";
    } else {
        echo $e->getMessage();
    }
}
?>
