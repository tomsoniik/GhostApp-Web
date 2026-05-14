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

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Odbieranie danych z JSON (fetch frontendowy)
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password) && !empty($data->username)) {
    $user->username = $data->username;
    $user->email = $data->email;
    $user->password = $data->password;

    // Walidacja długości username (3-24 znaki)
    if(strlen($data->username) < 3 || strlen($data->username) > 24) {
        http_response_code(400);
        echo json_encode(array("message" => "Nazwa użytkownika musi mieć od 3 do 24 znaków."));
        exit();
    }

    // Walidacja siły hasła (backend double-check)
    if(!User::validatePasswordStrength($data->password)) {
        http_response_code(400);
        echo json_encode(array("message" => "Hasło musi zawierać: małą literę, dużą literę, cyfrę i znak specjalny (min. 8 znaków)."));
        exit();
    }

    // Sprawdzenie czy username jest zajęty
    if($user->usernameExists()) {
        http_response_code(400);
        echo json_encode(array("message" => "Ta nazwa użytkownika jest już zajęta."));
        exit();
    }

    // Sprawdzenie czy email jest zajęty
    if($user->emailExists()) {
        http_response_code(400);
        echo json_encode(array("message" => "Ten identyfikator jest już zarejestrowany w systemie."));
        exit();
    }

    if($user->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Tożsamość została zainicjowana z sukcesem."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Błąd systemu podczas tworzenia tożsamości."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Niekompletne dane wejściowe. Podaj nazwę użytkownika, email i hasło."));
}
?>
