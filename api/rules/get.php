<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die(json_encode(["error" => "Brak user_id"]));

$query = "SELECT id, platform_name, trigger_keyword, reply_text, is_active, created_at 
          FROM auto_reply_rules 
          WHERE user_id = :user_id 
          ORDER BY created_at DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();

$rules = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $rules[] = $row;
}

echo json_encode($rules);
?>
