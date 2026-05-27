<?php
// GET /api/discord/status
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../auth/auth_helper.php';

$database = new Database();
$conn = $database->getConnection();

$userId = authenticateUser($conn);

try {
    $stmt = $conn->prepare("SELECT platform_name, status, guild_id, updated_at FROM user_platforms WHERE user_id = ? AND platform_name = 'discord' LIMIT 1");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            "connected" => true,
            "status" => $row['status'],
            "guild_id" => $row['guild_id'],
            "updated_at" => $row['updated_at']
        ]);
    } else {
        echo json_encode(["connected" => false]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
