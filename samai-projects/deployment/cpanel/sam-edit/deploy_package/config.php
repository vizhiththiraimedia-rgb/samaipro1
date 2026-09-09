<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Editor Studio
// Auto-generated: 2026-09-05T03:42:25.816373
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Editor Studio');
define('SERVICE_SLUG', 'sam-edit');
define('SERVICE_KEY', 'svc_sam-edit_033463e5b049');
define('SERVICE_ENDPOINT_PREFIX', '/media');

// Theme
define('THEME_COLOR', '#be123c');
define('THEME_COLOR_HOVER', '#aa0028');

// Site Info
define('SITE_TITLE', 'Sam Editor Studio');
define('SITE_TAGLINE', 'Rich media content editing and generation');
define('SITE_DOMAIN', 'https://sam-edit.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_CAPTION', 1);
define('CREDIT_COST_RESIZE', 1);


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
