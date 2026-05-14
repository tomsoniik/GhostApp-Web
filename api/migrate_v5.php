<?php
// Uruchomienie: php api/migrate_v5.php
require_once __DIR__ . '/config/Database.php';

$database = new Database();
$conn = $database->getConnection();

echo "Starting DB Migration v5 (AFK Mode)...\n";

try {
    // 1. Add afk_enabled
    $conn->exec("ALTER TABLE user_platforms ADD COLUMN afk_enabled TINYINT(1) DEFAULT 0 AFTER ai_enabled");
    echo "Added afk_enabled to user_platforms.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column afk_enabled already exists.\n";
    } else {
        echo "Error adding afk_enabled: " . $e->getMessage() . "\n";
    }
}

try {
    // 2. Add afk_message
    $conn->exec("ALTER TABLE user_platforms ADD COLUMN afk_message TEXT NULL AFTER afk_enabled");
    echo "Added afk_message to user_platforms.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column afk_message already exists.\n";
    } else {
        echo "Error adding afk_message: " . $e->getMessage() . "\n";
    }
}

echo "Migration v5 completed.\n";
?>
