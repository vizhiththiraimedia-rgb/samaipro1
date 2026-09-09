<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Image Studio
// Auto-generated: 2026-09-05T03:42:25.614645
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Image Studio');
define('SERVICE_SLUG', 'sam-image');
define('SERVICE_KEY', 'svc_sam-image_93a9e84cfeb5');
define('SERVICE_ENDPOINT_PREFIX', '/image');

// Theme
define('THEME_COLOR', '#8b5cf6');
define('THEME_COLOR_HOVER', '#7748e2');

// Site Info
define('SITE_TITLE', 'Sam Image Studio');
define('SITE_TAGLINE', 'AI image generation and editing');
define('SITE_DOMAIN', 'https://sam-image.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_GENERATE', 5);
define('CREDIT_COST_ANALYZE', 3);
define('CREDIT_COST_EDIT', 4);


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
