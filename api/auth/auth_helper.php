<?php
// api/auth/auth_helper.php

function authenticateUser($db) {
    $headers = apache_request_headers();
    $authHeader = null;

    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "Brak autoryzacji (Brak nagłówka Bearer)"]);
        exit();
    }

    $token = $matches[1];

    $stmt = $db->prepare("SELECT user_id FROM user_sessions WHERE token = ? AND expires_at > NOW() LIMIT 1");
    $stmt->execute([$token]);

    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(["error" => "Nieprawidłowy lub wygasły token sesji"]);
        exit();
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return (int)$row['user_id'];
}
?>
