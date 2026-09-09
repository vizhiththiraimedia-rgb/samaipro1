<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Bot (Telegram)
// Auto-generated: 2026-09-05T03:42:25.787050
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Bot (Telegram)');
define('SERVICE_SLUG', 'sam-bot');
define('SERVICE_KEY', 'svc_sam-bot_0bfd2fe03f0f');
define('SERVICE_ENDPOINT_PREFIX', '/telegram');

// Theme
define('THEME_COLOR', '#0088cc');
define('THEME_COLOR_HOVER', '#0074b8');

// Site Info
define('SITE_TITLE', 'Sam Bot (Telegram)');
define('SITE_TAGLINE', 'Telegram bot for AI commands');
define('SITE_DOMAIN', 'https://sam-bot.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_WEBHOOK', 0);
define('CREDIT_COST_SEND_MESSAGE', 1);


// Session
session_start();

// API Client
require_once __DIR__ . '/includes/api-client.php';

$sam_config = [
    'api_base' => SAMAI_API_BASE,
    'service_key' => SERVICE_KEY,
    'jwt_token' => null,
];
$api = new SamAI_API_Client($sam_config);
$session = new SamAI_Session();

if ($session->isLoggedIn()) {
    $api->setToken($session->getToken());
}

function redirect($url) {
    header("Location: " . $url);
    exit;
}

function jsonResponse($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function formatCredits($credits) {
    return number_format($credits);
}
?>
