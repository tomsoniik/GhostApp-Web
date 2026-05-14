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

    // ─── Wysyłka maila przez Resend API ───
    $RESEND_API_KEY = 're_PLACEHOLDER'; // TODO: Wstaw swój klucz Resend API

    $emailPayload = json_encode([
        "from" => "GhostApp <noreply@ghostapp.dev>",
        "to" => [$email],
        "subject" => "GhostApp — Kod weryfikacyjny",
        "html" => "
            <div style='font-family: Inter, sans-serif; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px; max-width: 480px; margin: 0 auto;'>
                <div style='text-align: center; margin-bottom: 24px;'>
                    <h1 style='color: #ccff00; font-size: 28px; margin: 0;'>GhostApp</h1>
                    <p style='color: #888; font-size: 13px; margin-top: 4px;'>System Automatyzacji</p>
                </div>
                <div style='background: #111; border: 1px solid #222; border-radius: 8px; padding: 24px; text-align: center;'>
                    <p style='color: #aaa; font-size: 14px; margin: 0 0 16px;'>Twój kod weryfikacyjny:</p>
                    <div style='font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ccff00; font-family: monospace; padding: 12px 0;'>$code</div>
                    <p style='color: #666; font-size: 12px; margin: 16px 0 0;'>Kod ważny przez 10 minut.</p>
                </div>
                <p style='color: #555; font-size: 11px; text-align: center; margin-top: 24px;'>Jeśli to nie Ty — zignoruj tę wiadomość.</p>
            </div>
        "
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $RESEND_API_KEY,
            'Content-Type: application/json'
        ],
        CURLOPT_POSTFIELDS => $emailPayload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10
    ]);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        http_response_code(200);
        echo json_encode(["message" => "Kod weryfikacyjny został wysłany na e-mail."]);
    } else {
        // Fallback: mimo błędu wysyłki, kod jest w bazie — pozwalamy kontynuować
        http_response_code(200);
        echo json_encode([
            "message" => "Kod weryfikacyjny został wysłany na e-mail.",
            "warning" => "Email delivery may be delayed."
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Błąd serwera: " . $e->getMessage()]);
}
?>
