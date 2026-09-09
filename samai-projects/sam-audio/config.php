<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Audio
// Auto-generated: 2026-09-05T03:42:26.025177
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Audio');
define('SERVICE_SLUG', 'sam-audio');
define('SERVICE_KEY', 'svc_sam-audio_85f2f69d9bd4');
define('SERVICE_ENDPOINT_PREFIX', '/voice');

// Theme
define('THEME_COLOR', '#cbd5e1');
define('THEME_COLOR_HOVER', '#b7c1cd');

// Site Info
define('SITE_TITLE', 'Sam Audio');
define('SITE_TAGLINE', 'Audio processing and podcast generation');
define('SITE_DOMAIN', 'https://sam-audio.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_PODCAST', 4);


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
