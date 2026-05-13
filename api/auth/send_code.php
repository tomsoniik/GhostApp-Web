<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    // W prawdziwym środowisku tutaj użylibyśmy PHPMailer do wysłania e-maila
    // Na ten moment generujemy 6-cyfrowy kod i zwracamy go w responsie (tylko dla celów deweloperskich!)
    
    $code = rand(100000, 999999);
    
    // TODO: Zapisz kod do bazy w tabeli `verification_codes` lub użyj Redis
    
    http_response_code(200);
    echo json_encode([
        "message" => "Kod weryfikacyjny został wysłany na e-mail.",
        "dev_code" => $code // Tylko do testów! W produkcji tego tu nie będzie.
    ]);
} else {
    http_response_code(400);
    echo json_encode(["message" => "Niekompletne dane. Brak e-maila."]);
}
?>
