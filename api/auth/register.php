<?php
// Headers
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Odbieranie danych z JSON (fetch frontendowy)
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password) && !empty($data->username) && !empty($data->code)) {
    $user->username = $data->username;
    $user->email = $data->email;
    $user->password = $data->password;
    $code = trim($data->code);

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

    // ─── Weryfikacja kodu z bazy danych ───
    try {
        $stmt = $db->prepare("SELECT id FROM verification_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$data->email, $code]);

        if ($stmt->rowCount() === 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Nieprawidłowy lub wygasły kod weryfikacyjny."));
            exit();
        }

        // Oznacz kod jako użyty
        $codeRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $markUsed = $db->prepare("UPDATE verification_codes SET used = 1 WHERE id = ?");
        $markUsed->execute([$codeRow['id']]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Błąd weryfikacji kodu."));
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
    echo json_encode(array("message" => "Niekompletne dane wejściowe. Podaj nazwę użytkownika, email, hasło i kod weryfikacyjny."));
}
?>
