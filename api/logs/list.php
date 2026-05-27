<?php
// GET /api/logs/list.php?limit=50 — pobierz logi zdarzeń
require_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../auth/auth_helper.php';

$database = new Database();
$conn = $database->getConnection();

$userId = authenticateUser($conn);
$limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 50;

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
