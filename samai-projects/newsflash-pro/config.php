<?php
// =========================================================================
// SAM AI - Service Configuration: NewsFlash Pro
// Auto-generated: 2026-09-04T02:56:23.913304
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'NewsFlash Pro');
define('SERVICE_SLUG', 'newsflash-pro');
define('SERVICE_KEY', 'sk-samai-testkey-abc123def456');
define('SERVICE_ENDPOINT_PREFIX', '/social-news');

// Theme
define('THEME_COLOR', '#ef4444');
define('THEME_COLOR_HOVER', '#db3030');

// Site Info
define('SITE_TITLE', 'NewsFlash Pro');
define('SITE_TAGLINE', 'Generate AI social media posts from news URLs');
define('SITE_DOMAIN', 'https://newsflash.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_GENERATE_POST', 2);
define('CREDIT_COST_SCHEDULE', 1);
define('CREDIT_COST_TRENDING', 1);


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
