<?php
// =========================================================================
// SAM AI - Service Configuration: IMGR Sam
// Auto-generated: 2026-09-05T03:42:25.887699
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'IMGR Sam');
define('SERVICE_SLUG', 'imgr-sam');
define('SERVICE_KEY', 'svc_imgr-sam_f692956e61cc');
define('SERVICE_ENDPOINT_PREFIX', '/image');

// Theme
define('THEME_COLOR', '#a855f7');
define('THEME_COLOR_HOVER', '#9441e3');

// Site Info
define('SITE_TITLE', 'IMGR Sam');
define('SITE_TAGLINE', 'AI image generation with advanced settings');
define('SITE_DOMAIN', 'https://imgr-sam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_ADVANCED', 8);


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
