<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/Database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die(json_encode(["error" => "Brak user_id"]));

$query = "SELECT platform_name, access_token, bot_scope, status, ai_api_key, ai_prompt, ai_enabled, afk_enabled, afk_message FROM user_platforms WHERE user_id = :user_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();

$platforms = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $platforms[$row['platform_name']] = [
        'token' => $row['access_token'],
        'scope' => $row['bot_scope'],
        'status' => $row['status'],
        'ai_api_key' => $row['ai_api_key'],
        'ai_prompt' => $row['ai_prompt'],
        'ai_enabled' => (bool)$row['ai_enabled'],
        'afk_enabled' => (bool)$row['afk_enabled'],
        'afk_message' => $row['afk_message']
    ];
}

echo json_encode($platforms);
?>
