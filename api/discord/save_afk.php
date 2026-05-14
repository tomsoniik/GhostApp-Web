<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->user_id)) {
    http_response_code(400);
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

$userId = (int)$data->user_id;
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
