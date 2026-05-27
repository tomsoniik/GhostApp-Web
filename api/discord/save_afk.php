<?php
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../auth/auth_helper.php';

$database = new Database();
$conn = $database->getConnection();

$userId = authenticateUser($conn);

$data = json_decode(file_get_contents("php://input"));
$afkEnabled = isset($data->afk_enabled) ? (int)$data->afk_enabled : 0;
$afkMessage = isset($data->afk_message) ? trim($data->afk_message) : null;

try {
    $stmt = $conn->prepare("UPDATE user_platforms SET afk_enabled = ?, afk_message = ?, updated_at = NOW() WHERE user_id = ? AND platform_name = 'discord'");
    $stmt->execute([$afkEnabled, $afkMessage, $userId]);

    echo json_encode(["success" => true, "message" => "Zapisano ustawienia AFK"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
