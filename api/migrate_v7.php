<?php
// Uruchomienie: php api/migrate_v7.php lub GET /api/migrate_v7.php
require_once __DIR__ . '/config/Database.php';

$database = new Database();
$conn = $database->getConnection();

echo "Starting DB Migration v7 (User Sessions for Auth)...\n";

try {
    $conn->exec("
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(64) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_token (token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    echo "Created user_sessions table.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "Migration v7 completed.\n";
?>
