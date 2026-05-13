<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die(json_encode(["error" => "Brak user_id"]));

$query = "SELECT id, platform, event_type, source_user, source_channel, trigger_keyword, original_message, reply_sent, created_at 
          FROM event_logs 
          WHERE user_id = :user_id 
          ORDER BY created_at DESC
          LIMIT 50";

$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();

$logs = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $logs[] = $row;
}

echo json_encode($logs);
?>
