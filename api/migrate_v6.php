<?php
// Uruchomienie: GET /api/migrate_v6.php
require_once __DIR__ . '/config/Database.php';

$database = new Database();
$conn = $database->getConnection();

echo "Starting DB Migration v6 (Verification Codes)...\n";

try {
    $conn->exec("
        CREATE TABLE IF NOT EXISTS verification_codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            code VARCHAR(6) NOT NULL,
            expires_at DATETIME NOT NULL,
            used TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email_code (email, code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    echo "Created verification_codes table.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "Migration v6 completed.\n";
?>
