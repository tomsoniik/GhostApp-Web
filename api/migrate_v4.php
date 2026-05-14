<?php
/**
 * Migracja v4: Dodanie kolumny username do tabeli users.
 * Uruchom raz: php api/migrate_v4.php
 */

include_once __DIR__ . '/config/Database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Sprawdź czy kolumna już istnieje
    $check = $db->query("SHOW COLUMNS FROM users LIKE 'username'");
    if ($check->rowCount() === 0) {
        $db->exec("ALTER TABLE users ADD COLUMN username VARCHAR(24) NOT NULL DEFAULT '' AFTER id");
        $db->exec("ALTER TABLE users ADD UNIQUE INDEX idx_username (username)");
        echo json_encode(["message" => "Migracja v4 OK: Kolumna 'username' dodana do tabeli 'users'."]);
    } else {
        echo json_encode(["message" => "Migracja v4: Kolumna 'username' już istnieje — pominięto."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Błąd migracji v4: " . $e->getMessage()]);
}
?>
