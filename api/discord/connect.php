<?php
// POST /api/discord/connect — zapisz bot token w user_platforms
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../auth/auth_helper.php';

$database = new Database();
$conn = $database->getConnection();

$userId = authenticateUser($conn);

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->bot_token)) {
    http_response_code(400);
    echo json_encode(["error" => "bot_token jest wymagany"]);
    exit;
}

$botToken = trim($data->bot_token);
$botScope = !empty($data->bot_scope) ? trim($data->bot_scope) : 'all';

$aiApiKey = isset($data->ai_api_key) ? trim($data->ai_api_key) : null;
$aiPrompt = isset($data->ai_prompt) ? trim($data->ai_prompt) : null;
$aiEnabled = isset($data->ai_enabled) ? (int)$data->ai_enabled : 0;
$afkEnabled = isset($data->afk_enabled) ? (int)$data->afk_enabled : 0;
$afkMessage = isset($data->afk_message) ? trim($data->afk_message) : null;

try {
    // Upsert — jeśli wpis discord już istnieje, nadpisz token
    $check = $conn->prepare("SELECT id FROM user_platforms WHERE user_id = ? AND platform_name = 'discord'");
    $check->execute([$userId]);

    if ($check->rowCount() > 0) {
        $stmt = $conn->prepare("UPDATE user_platforms SET access_token = ?, bot_scope = ?, ai_api_key = ?, ai_prompt = ?, ai_enabled = ?, afk_enabled = ?, afk_message = ?, status = 'active', updated_at = NOW() WHERE user_id = ? AND platform_name = 'discord'");
        $stmt->execute([$botToken, $botScope, $aiApiKey, $aiPrompt, $aiEnabled, $afkEnabled, $afkMessage, $userId]);
    } else {
        $stmt = $conn->prepare("INSERT INTO user_platforms (user_id, platform_name, access_token, bot_scope, ai_api_key, ai_prompt, ai_enabled, afk_enabled, afk_message, status) VALUES (?, 'discord', ?, ?, ?, ?, ?, ?, ?, 'active')");
        $stmt->execute([$userId, $botToken, $botScope, $aiApiKey, $aiPrompt, $aiEnabled, $afkEnabled, $afkMessage]);
    }

    // Dodaj log systemowy
    $log = $conn->prepare("INSERT INTO event_logs (user_id, platform, event_type, source_user, trigger_keyword) VALUES (?, 'discord', 'system', 'SYSTEM', 'BOT_CONNECTED')");
    $log->execute([$userId]);

    echo json_encode(["success" => true, "message" => "Zapisano User Token i zakres działania (Scope: $botScope)"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
