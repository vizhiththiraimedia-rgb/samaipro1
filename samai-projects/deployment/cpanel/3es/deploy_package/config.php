<?php
// =========================================================================
// SAM AI - Service Configuration: 3ES (ESPN)
// Auto-generated: 2026-09-05T03:42:26.190994
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', '3ES (ESPN)');
define('SERVICE_SLUG', '3es');
define('SERVICE_KEY', 'svc_3es_c96bc71c32ed');
define('SERVICE_ENDPOINT_PREFIX', '/sports');

// Theme
define('THEME_COLOR', '#1e40af');
define('THEME_COLOR_HOVER', '#0a2c9b');

// Site Info
define('SITE_TITLE', '3ES (ESPN)');
define('SITE_TAGLINE', 'ESPN sports analytics and news');
define('SITE_DOMAIN', 'https://3es.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_SCORES', 1);
define('CREDIT_COST_ANALYSIS', 3);


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
