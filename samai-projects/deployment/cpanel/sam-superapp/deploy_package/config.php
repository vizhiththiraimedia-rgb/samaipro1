<?php
// =========================================================================
// SAM AI - Service Configuration: SAM SuperApp
// Auto-generated: 2026-09-08T03:13:54.259414
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'SAM SuperApp');
define('SERVICE_SLUG', 'sam-superapp');
define('SERVICE_KEY', 'REPLACE_WITH_API_KEY');
define('SERVICE_ENDPOINT_PREFIX', '/superapp');

// Theme
define('THEME_COLOR', '#e83e8c');
define('THEME_COLOR_HOVER', '#d42a78');

// Site Info
define('SITE_TITLE', 'SAM SuperApp');
define('SITE_TAGLINE', 'Helakuru-like super app for Sri Lanka with News, Typing, and Voice tools');
define('SITE_DOMAIN', 'sam-superapp.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_GET_NEWS', 1);
define('CREDIT_COST_TRANSLATE_TYPE', 1);


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
