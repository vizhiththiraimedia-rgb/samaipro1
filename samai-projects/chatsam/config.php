<?php
// =========================================================================
// SAM AI - Service Configuration: TS Chat
// Auto-generated: 2026-09-05T03:42:26.092316
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'TS Chat');
define('SERVICE_SLUG', 'chatsam');
define('SERVICE_KEY', 'svc_chatsam_7553e5057576');
define('SERVICE_ENDPOINT_PREFIX', '/chat');

// Theme
define('THEME_COLOR', '#0ea5e9');
define('THEME_COLOR_HOVER', '#0091d5');

// Site Info
define('SITE_TITLE', 'TS Chat');
define('SITE_TAGLINE', 'Team chat with AI assistance');
define('SITE_DOMAIN', 'https://chatsam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_TEAM_CHAT', 1);


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
