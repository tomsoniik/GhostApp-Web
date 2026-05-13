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

// Odbieranie danych z JSON (fetch frontendowy)
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $user->password = $data->password;

    if($user->emailExists()) {
        http_response_code(400); // Bad Request
        echo json_encode(array("message" => "Ten identyfikator jest już zarejestrowany w systemie."));
    } else {
        if($user->create()) {
            http_response_code(201); // Created
            echo json_encode(array("message" => "Tożsamość została zainicjowana z sukcesem."));
        } else {
            http_response_code(503); // Service Unavailable
            echo json_encode(array("message" => "Błąd systemu podczas tworzenia tożsamości."));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Niekompletne dane wejściowe. Podaj email i hasło."));
}
?>
