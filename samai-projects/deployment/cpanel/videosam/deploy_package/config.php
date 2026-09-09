<?php
// =========================================================================
// SAM AI - Service Configuration: TS Video
// Auto-generated: 2026-09-05T03:42:26.143466
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'TS Video');
define('SERVICE_SLUG', 'videosam');
define('SERVICE_KEY', 'svc_videosam_b393db6df828');
define('SERVICE_ENDPOINT_PREFIX', '/media/video');

// Theme
define('THEME_COLOR', '#be123c');
define('THEME_COLOR_HOVER', '#aa0028');

// Site Info
define('SITE_TITLE', 'TS Video');
define('SITE_TAGLINE', 'AI video production and editing suite');
define('SITE_DOMAIN', 'https://videosam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_PRODUCE', 10);


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
