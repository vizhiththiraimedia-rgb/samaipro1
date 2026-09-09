<?php
// =========================================================================
// SAM AI - Service Configuration: WebDev LK
// Auto-generated: 2026-09-07T08:50:54.871456
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'WebDev LK');
define('SERVICE_SLUG', 'webdev-lk');
define('SERVICE_KEY', 'sk-samai-dummykey');
define('SERVICE_ENDPOINT_PREFIX', '/web-builder');

// Theme
define('THEME_COLOR', '#4f46e5');
define('THEME_COLOR_HOVER', '#3b32d1');

// Site Info
define('SITE_TITLE', 'WebDev LK');
define('SITE_TAGLINE', 'AI Website Builder and Generator');
define('SITE_DOMAIN', 'webdev-lk.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_GENERATE_SITE', 10);


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
