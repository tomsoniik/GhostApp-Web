<?php
// GET /api/stats/get.php?user_id=X — live statystyki dashboardu
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "user_id jest wymagany"]);
    exit;
}

try {
    // 1. Dzisiejsze akcje (event_logs z dzisiaj)
    $stmt = $conn->prepare("
        SELECT COUNT(*) as today_actions
        FROM event_logs
        WHERE user_id = ? AND DATE(created_at) = CURDATE()
    ");
    $stmt->execute([$userId]);
    $todayActions = (int) $stmt->fetch(PDO::FETCH_ASSOC)['today_actions'];

    // 2. Łączna liczba akcji (all time)
    $stmt = $conn->prepare("
        SELECT COUNT(*) as total_actions
        FROM event_logs
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $totalActions = (int) $stmt->fetch(PDO::FETCH_ASSOC)['total_actions'];

    // 3. Skuteczność auto-odpowiedzi (auto_reply / wszystkie zdarzenia z ostatnich 7 dni)
    $stmt = $conn->prepare("
        SELECT 
            COUNT(*) as total_events,
            SUM(CASE WHEN event_type = 'auto_reply' THEN 1 ELSE 0 END) as auto_replies
        FROM event_logs
        WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ");
    $stmt->execute([$userId]);
    $effRow = $stmt->fetch(PDO::FETCH_ASSOC);

    $totalEvents = (int) $effRow['total_events'];
    $autoReplies = (int) $effRow['auto_replies'];
    $efficiency = $totalEvents > 0 ? round(($autoReplies / $totalEvents) * 100, 1) : 0;

    // 4. Status platform (user_platforms)
    $stmt = $conn->prepare("
        SELECT platform_name, status, updated_at
        FROM user_platforms
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $platformRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $platforms = [];
    foreach ($platformRows as $row) {
        $platforms[$row['platform_name']] = [
            'status'     => $row['status'],
            'updated_at' => $row['updated_at']
        ];
    }

    // 5. Aktywne reguły
    $stmt = $conn->prepare("
        SELECT COUNT(*) as active_rules
        FROM auto_reply_rules
        WHERE user_id = ? AND is_active = 1
    ");
    $stmt->execute([$userId]);
    $activeRules = (int) $stmt->fetch(PDO::FETCH_ASSOC)['active_rules'];

    // 6. Dzisiejsze zdarzenia per typ (breakdown)
    $stmt = $conn->prepare("
        SELECT event_type, COUNT(*) as count
        FROM event_logs
        WHERE user_id = ? AND DATE(created_at) = CURDATE()
        GROUP BY event_type
    ");
    $stmt->execute([$userId]);
    $todayBreakdown = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $todayBreakdown[$row['event_type']] = (int) $row['count'];
    }

    echo json_encode([
        "today_actions"   => $todayActions,
        "total_actions"   => $totalActions,
        "efficiency"      => $efficiency,
        "auto_replies_7d" => $autoReplies,
        "total_events_7d" => $totalEvents,
        "active_rules"    => $activeRules,
        "platforms"        => $platforms,
        "today_breakdown" => $todayBreakdown
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
