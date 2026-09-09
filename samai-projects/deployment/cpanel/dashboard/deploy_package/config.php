<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Dashboard
// Auto-generated: 2026-09-05T03:42:26.267435
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Dashboard');
define('SERVICE_SLUG', 'dashboard');
define('SERVICE_KEY', 'svc_dashboard_a99f4155e548');
define('SERVICE_ENDPOINT_PREFIX', '/chat');

// Theme
define('THEME_COLOR', '#1e40af');
define('THEME_COLOR_HOVER', '#0a2c9b');

// Site Info
define('SITE_TITLE', 'Sam Dashboard');
define('SITE_TAGLINE', 'Central Sam AI dashboard');
define('SITE_DOMAIN', 'https://dashboard.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_DASHBOARD', 0);


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
