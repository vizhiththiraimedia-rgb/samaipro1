<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Tools
// Auto-generated: 2026-09-05T03:42:26.065185
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Tools');
define('SERVICE_SLUG', 'samt-tools');
define('SERVICE_KEY', 'svc_samt-tools_3f0502ba2e8c');
define('SERVICE_ENDPOINT_PREFIX', '/tools');

// Theme
define('THEME_COLOR', '#94a3b8');
define('THEME_COLOR_HOVER', '#808fa4');

// Site Info
define('SITE_TITLE', 'Sam Tools');
define('SITE_TAGLINE', 'Utility tools and helper functions');
define('SITE_DOMAIN', 'https://samt-tools.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_WHOIS', 0);
define('CREDIT_COST_PING', 0);


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
