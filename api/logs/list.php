<?php
// GET /api/logs/list.php?user_id=X&limit=50 — pobierz logi zdarzeń
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 50;

if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "user_id jest wymagany"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT id, platform, event_type, source_user, source_channel, 
               trigger_keyword, original_message, reply_sent, created_at
        FROM event_logs 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    ");
    $stmt->bindValue(1, $userId, PDO::PARAM_INT);
    $stmt->bindValue(2, $limit, PDO::PARAM_INT);
    $stmt->execute();

    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "count" => count($logs),
        "logs" => $logs
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
