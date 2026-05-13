<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Brak wymaganych danych"]);
    exit();
}

$query = "DELETE FROM auto_reply_rules WHERE id = :id AND user_id = :user_id";

$stmt = $db->prepare($query);
$stmt->bindParam(':id', $data->id);
$stmt->bindParam(':user_id', $data->user_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Reguła usunięta"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Błąd bazy danych"]);
}
?>
