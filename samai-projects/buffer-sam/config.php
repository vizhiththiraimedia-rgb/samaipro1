<?php
// =========================================================================
// SAM AI - Service Configuration: Buffer Sam
// Auto-generated: 2026-09-05T03:42:25.844730
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Buffer Sam');
define('SERVICE_SLUG', 'buffer-sam');
define('SERVICE_KEY', 'svc_buffer-sam_b842a48296aa');
define('SERVICE_ENDPOINT_PREFIX', '/social');

// Theme
define('THEME_COLOR', '#1f2937');
define('THEME_COLOR_HOVER', '#0b1523');

// Site Info
define('SITE_TITLE', 'Buffer Sam');
define('SITE_TAGLINE', 'Social media scheduling buffer system');
define('SITE_DOMAIN', 'https://buffer-sam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_QUEUE', 1);
define('CREDIT_COST_SCHEDULE', 2);


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
