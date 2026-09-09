<?php
// =========================================================================
// SAM AI - Service Configuration: SAM AI Studio
// Auto-generated: 2026-09-05T14:07:23.533804
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'SAM AI Studio');
define('SERVICE_SLUG', 'samai-studio');
define('SERVICE_KEY', 'svc_samai-studio_a1b2c3d4e5f6');
define('SERVICE_ENDPOINT_PREFIX', '/music/studio');

// Theme
define('THEME_COLOR', '#8b5cf6');
define('THEME_COLOR_HOVER', '#7748e2');

// Site Info
define('SITE_TITLE', 'SAM AI Studio');
define('SITE_TAGLINE', 'AI-powered Digital Audio Workstation (DAW) for music creation');
define('SITE_DOMAIN', 'samai-studio.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_CREATE_TRACK', 3);
define('CREDIT_COST_EXPORT_PROJECT', 5);


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
