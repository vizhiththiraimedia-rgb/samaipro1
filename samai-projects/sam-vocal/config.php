<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Vocal
// Auto-generated: 2026-09-05T03:42:26.038159
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Vocal');
define('SERVICE_SLUG', 'sam-vocal');
define('SERVICE_KEY', 'svc_sam-vocal_9134b5a1cdb0');
define('SERVICE_ENDPOINT_PREFIX', '/voice');

// Theme
define('THEME_COLOR', '#64748b');
define('THEME_COLOR_HOVER', '#506077');

// Site Info
define('SITE_TITLE', 'Sam Vocal');
define('SITE_TAGLINE', 'Voice command and vocal AI interface');
define('SITE_DOMAIN', 'https://sam-vocal.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_TRANSCRIBE', 2);


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
