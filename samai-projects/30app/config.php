<?php
// =========================================================================
// SAM AI - Service Configuration: 30 App
// Auto-generated: 2026-09-05T03:42:26.226786
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', '30 App');
define('SERVICE_SLUG', '30app');
define('SERVICE_KEY', 'svc_30app_0929b8731da7');
define('SERVICE_ENDPOINT_PREFIX', '/app');

// Theme
define('THEME_COLOR', '#374151');
define('THEME_COLOR_HOVER', '#232d3d');

// Site Info
define('SITE_TITLE', '30 App');
define('SITE_TAGLINE', 'General 30-series application platform');
define('SITE_DOMAIN', 'https://30app.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_RUN', 0);


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
