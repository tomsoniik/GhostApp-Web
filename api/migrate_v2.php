<?php
// Rozszerzenie schematu bazy — tabela event_logs do przechowywania prawdziwych logów z Discorda
// Uruchom RAZ po init_db.php

$host = "localhost";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=armessage_db;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Tabela logów zdarzeń (wiadomości przechwycone przez bota)
    $sql_logs = "
        CREATE TABLE IF NOT EXISTS event_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            platform VARCHAR(50) NOT NULL DEFAULT 'discord',
            event_type ENUM('auto_reply', 'trigger_match', 'system', 'error') NOT NULL DEFAULT 'auto_reply',
            source_user VARCHAR(255) NOT NULL,
            source_channel VARCHAR(255) DEFAULT NULL,
            trigger_keyword VARCHAR(255) DEFAULT NULL,
            original_message TEXT DEFAULT NULL,
            reply_sent TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_created (user_id, created_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conn->exec($sql_logs);
    echo "Tabela 'event_logs' gotowa.<br>";

    // Rozszerzenie user_platforms o kolumnę guild_id
    try {
        $conn->exec("ALTER TABLE user_platforms ADD COLUMN guild_id VARCHAR(255) DEFAULT NULL AFTER access_token");
        echo "Kolumna 'guild_id' dodana do user_platforms.<br>";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "Kolumna 'guild_id' już istnieje — OK.<br>";
        } else {
            throw $e;
        }
    }

    echo "<br><b style='color:green'>Rozszerzenie bazy zakończone pomyślnie!</b>";

} catch (PDOException $e) {
    echo "<b style='color:red'>Błąd:</b> " . $e->getMessage();
}
?>
