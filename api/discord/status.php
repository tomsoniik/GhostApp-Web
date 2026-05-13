<?php
// GET /api/discord/status?user_id=X — sprawdź status połączenia Discord
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once '../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "user_id jest wymagany"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT platform_name, status, guild_id, updated_at FROM user_platforms WHERE user_id = ? AND platform_name = 'discord' LIMIT 1");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            "connected" => true,
            "status" => $row['status'],
            "guild_id" => $row['guild_id'],
            "updated_at" => $row['updated_at']
        ]);
    } else {
        echo json_encode(["connected" => false]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
