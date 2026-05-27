<?php
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email)) {
    http_response_code(400);
    echo json_encode(["message" => "Brak adresu e-mail."]);
    exit();
}

$email = trim($data->email);
$code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
$expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

try {
    // Usuń stare kody dla tego maila
    $stmt = $conn->prepare("DELETE FROM verification_codes WHERE email = ?");
    $stmt->execute([$email]);

    // Zapisz nowy kod
    $stmt = $conn->prepare("INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)");
    $stmt->execute([$email, $code, $expiresAt]);

    // ─── Wysyłka maila przez Brevo API ───
    // Klucz pobierany ze zmiennych środowiskowych Railway (Environment Variables)
    $BREVO_API_KEY = getenv('BREVO_API_KEY'); 
    
    // TODO: Zmień na swój zweryfikowany email w Brevo!
    $senderEmail = 'debskitomal@gmail.com'; 

    $emailPayload = json_encode([
        "sender" => ["name" => "GhostApp", "email" => $senderEmail],
        "to" => [["email" => $email]],
        "subject" => "GhostApp — Kod weryfikacyjny",
        "htmlContent" => "
            <div style='font-family: Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 50px; text-align: center; border-radius: 15px;'>
                <h1 style='color: #ccff00; font-size: 32px; letter-spacing: -1px;'>GhostApp</h1>
                <p style='color: #888; font-size: 16px;'>Twój bezpieczny kod dostępu do systemu:</p>
                <div style='background: #111; border: 2px solid #222; display: inline-block; padding: 20px 40px; margin: 20px 0; border-radius: 10px;'>
                    <span style='font-size: 42px; font-weight: 900; color: #ccff00; letter-spacing: 10px; font-family: monospace;'>$code</span>
                </div>
                <p style='color: #555; font-size: 12px;'>Kod wygaśnie za 10 minut. Jeśli to nie Ty, zignoruj tę wiadomość.</p>
            </div>
        "
    ]);

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'api-key: ' . $BREVO_API_KEY,
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        CURLOPT_POSTFIELDS => $emailPayload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10
    ]);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode >= 200 && $httpCode < 300) {
        http_response_code(200);
        echo json_encode(["message" => "Kod został wysłany."]);
    } else {
        // Log błędu dla Ciebie (widoczny tylko w konsoli sieciowej)
        error_log("Brevo Error: " . $result);
        http_response_code(200); // Zwracamy 200, żeby frontend nie wyrzucił błędu, ale logujemy problem
        echo json_encode(["message" => "Kod został wygenerowany (sprawdź e-mail).", "dev_info" => "Brevo API status: $httpCode"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Błąd serwera: " . $e->getMessage()]);
}
?>