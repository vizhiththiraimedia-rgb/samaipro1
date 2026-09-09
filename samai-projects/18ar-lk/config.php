<?php
// =========================================================================
// SAM AI - Service Configuration: 18AR Sri Lanka
// Auto-generated: 2026-09-05T03:42:26.242359
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', '18AR Sri Lanka');
define('SERVICE_SLUG', '18ar-lk');
define('SERVICE_KEY', 'svc_18ar-lk_384e85175260');
define('SERVICE_ENDPOINT_PREFIX', '/research');

// Theme
define('THEME_COLOR', '#059669');
define('THEME_COLOR_HOVER', '#008255');

// Site Info
define('SITE_TITLE', '18AR Sri Lanka');
define('SITE_TAGLINE', '18th Amendment research - Sri Lanka');
define('SITE_DOMAIN', 'https://18ar-lk.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_RESEARCH_AR', 3);


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
