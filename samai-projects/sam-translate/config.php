<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Translate
// Auto-generated: 2026-09-05T03:42:25.598451
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Translate');
define('SERVICE_SLUG', 'sam-translate');
define('SERVICE_KEY', 'svc_sam-translate_f6fa85d2c89a');
define('SERVICE_ENDPOINT_PREFIX', '/translate');

// Theme
define('THEME_COLOR', '#10b981');
define('THEME_COLOR_HOVER', '#00a56d');

// Site Info
define('SITE_TITLE', 'Sam Translate');
define('SITE_TAGLINE', 'Translate between Sinhala, Tamil, and English');
define('SITE_DOMAIN', 'https://sam-translate.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_TEXT', 1);
define('CREDIT_COST_DOCUMENT', 3);


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
