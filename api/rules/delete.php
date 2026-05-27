<?php
require_once __DIR__ . '/../cors.php';
header('Content-Type: application/json');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../auth/auth_helper.php';

$database = new Database();
$db = $database->getConnection();

$user_id = authenticateUser($db);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(["error" => "Brak wymaganych danych"]);
    exit();
}

$query = "DELETE FROM auto_reply_rules WHERE id = :id AND user_id = :user_id";

$stmt = $db->prepare($query);
$stmt->bindParam(':id', $data->id);
$stmt->bindParam(':user_id', $user_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Reguła usunięta"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Błąd bazy danych"]);
}
?>
