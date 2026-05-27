<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../auth/auth_helper.php';

$database = new Database();
$db = $database->getConnection();

$user_id = authenticateUser($db);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->platform_name) || !isset($data->trigger_keyword) || !isset($data->reply_text)) {
    http_response_code(400);
    echo json_encode(["error" => "Brak wymaganych danych"]);
    exit();
}

$query = "INSERT INTO auto_reply_rules (user_id, platform_name, trigger_keyword, reply_text, is_active) 
          VALUES (:user_id, :platform_name, :trigger_keyword, :reply_text, 1)";

$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user_id);
$stmt->bindParam(':platform_name', $data->platform_name);
$stmt->bindParam(':trigger_keyword', $data->trigger_keyword);
$stmt->bindParam(':reply_text', $data->reply_text);

if ($stmt->execute()) {
    echo json_encode(["message" => "Reguła dodana pomyślnie", "id" => $db->lastInsertId()]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Błąd bazy danych"]);
}
?>
