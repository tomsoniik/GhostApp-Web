<?php
// cors.php
header("Access-Control-Allow-Origin: https://ghost-app-web.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Obsługa zapytań wstępnych (Preflight OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
