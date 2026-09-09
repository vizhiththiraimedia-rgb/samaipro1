<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Video Studio
// Auto-generated: 2026-09-05T03:42:25.641227
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Video Studio');
define('SERVICE_SLUG', 'sam-video');
define('SERVICE_KEY', 'svc_sam-video_d1d182d5709b');
define('SERVICE_ENDPOINT_PREFIX', '/media/video');

// Theme
define('THEME_COLOR', '#ec4899');
define('THEME_COLOR_HOVER', '#d83485');

// Site Info
define('SITE_TITLE', 'Sam Video Studio');
define('SITE_TAGLINE', 'AI video generation and editing');
define('SITE_DOMAIN', 'https://sam-video.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_GENERATE', 10);
define('CREDIT_COST_EDIT', 8);
define('CREDIT_COST_ANALYZE', 5);


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
