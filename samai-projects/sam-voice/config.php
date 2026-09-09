<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Audio Studio
// Auto-generated: 2026-09-05T03:42:25.627677
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Audio Studio');
define('SERVICE_SLUG', 'sam-voice');
define('SERVICE_KEY', 'svc_sam-voice_0ee5325ffc74');
define('SERVICE_ENDPOINT_PREFIX', '/voice');

// Theme
define('THEME_COLOR', '#f59e0b');
define('THEME_COLOR_HOVER', '#e18a00');

// Site Info
define('SITE_TITLE', 'Sam Audio Studio');
define('SITE_TAGLINE', 'Text-to-speech and speech-to-text');
define('SITE_DOMAIN', 'https://sam-voice.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_TTS', 2);
define('CREDIT_COST_STT', 2);


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
