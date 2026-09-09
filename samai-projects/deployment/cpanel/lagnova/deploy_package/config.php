<?php
// =========================================================================
// SAM AI - Service Configuration: Lagnova
// Auto-generated: 2026-09-05T03:42:25.909785
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Lagnova');
define('SERVICE_SLUG', 'lagnova');
define('SERVICE_KEY', 'svc_lagnova_46dccfdde68f');
define('SERVICE_ENDPOINT_PREFIX', '/astrology');

// Theme
define('THEME_COLOR', '#7c3aed');
define('THEME_COLOR_HOVER', '#6826d9');

// Site Info
define('SITE_TITLE', 'Lagnova');
define('SITE_TAGLINE', 'Vedic astrology and prediction platform');
define('SITE_DOMAIN', 'https://lagnova.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_FULL_CHART', 5);


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
