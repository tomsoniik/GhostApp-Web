<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/Database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $email_exists = $user->emailExists();

    // Sprawdzenie hasła i czy user istnieje
    if($email_exists && password_verify($data->password, $user->password)) {
        // Generujemy prosty token sesyjny (w przyszłości do wymiany na prawdziwy JWT)
        $token = bin2hex(random_bytes(16));
        
        http_response_code(200); // OK
        echo json_encode(array(
            "message" => "Zalogowano z sukcesem.",
            "token" => $token,
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
