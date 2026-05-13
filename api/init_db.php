<?php
// Uruchom ten skrypt tylko raz, aby zainicjować strukturę bazy danych.

$host = "localhost";
$username = "root";
$password = "";

try {
    // Łączymy się z serwerem MySQL bez określenia bazy danych
    $conn = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Tworzenie bazy danych
    $sql = "CREATE DATABASE IF NOT EXISTS armessage_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $conn->exec($sql);
    echo "Baza danych 'armessage_db' utworzona lub już istnieje.<br>";

    // 2. Wybranie bazy
    $conn->exec("USE armessage_db");

    // 3. Tworzenie tabeli users
    $sql_users = "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conn->exec($sql_users);
    echo "Tabela 'users' gotowa.<br>";

    // 4. (Opcjonalnie na później) Tworzenie tabeli na połączone platformy
    $sql_platforms = "
        CREATE TABLE IF NOT EXISTS user_platforms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            platform_name VARCHAR(50) NOT NULL, /* np. 'steam', 'discord', 'messenger' */
            access_token TEXT,
            status ENUM('active', 'disconnected', 'error') DEFAULT 'disconnected',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conn->exec($sql_platforms);
    echo "Tabela 'user_platforms' gotowa.<br>";

    // 5. Tworzenie tabeli dla reguł autorespondera
    $sql_rules = "
        CREATE TABLE IF NOT EXISTS auto_reply_rules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            platform_name VARCHAR(50) NOT NULL,
            trigger_keyword VARCHAR(255) NOT NULL,
            reply_text TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conn->exec($sql_rules);
    echo "Tabela 'auto_reply_rules' gotowa.<br>";

    echo "<br><b style='color:green'>System bazodanowy został z powodzeniem zainicjowany!</b> Możesz usunąć ten plik ze względów bezpieczeństwa.";

} catch (PDOException $e) {
    echo "<b style='color:red'>Błąd podczas inicjalizacji bazy:</b> " . $e->getMessage();
}
?>
