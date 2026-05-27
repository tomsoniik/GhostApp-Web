<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../auth/auth_helper.php';

$database = new Database();
$db = $database->getConnection();

$user_id = authenticateUser($db);

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
