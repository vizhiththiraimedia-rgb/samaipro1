<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Media Studio
// Auto-generated: 2026-09-05T03:42:25.830847
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Media Studio');
define('SERVICE_SLUG', 'sam-media');
define('SERVICE_KEY', 'svc_sam-media_89baec009cc3');
define('SERVICE_ENDPOINT_PREFIX', '/media');

// Theme
define('THEME_COLOR', '#7e22ce');
define('THEME_COLOR_HOVER', '#6a0eba');

// Site Info
define('SITE_TITLE', 'Sam Media Studio');
define('SITE_TAGLINE', 'All-in-one media content creation');
define('SITE_DOMAIN', 'https://sam-media.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_TEMPLATE', 2);


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
