<?php
// Headers
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $email_exists = $user->emailExists();

    if($email_exists && password_verify($data->password, $user->password)) {
        $token = bin2hex(random_bytes(32)); // 64 znaki
        $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        
        // Zapis tokenu do bazy
        $stmt = $db->prepare("INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$user->id, $token, $expires_at]);
        
        http_response_code(200); // OK
        echo json_encode(array(
            "message" => "Zalogowano z sukcesem.",
            "token" => $token,
            "user_id" => $user->id,
            "email" => $user->email
        ));
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(array("message" => "Odmowa dostępu. Nieprawidłowe dane logowania."));
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Niekompletne dane wejściowe."));
}
?>
