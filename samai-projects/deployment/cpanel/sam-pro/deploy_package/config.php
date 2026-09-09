<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Pro
// Auto-generated: 2026-09-05T03:42:25.746444
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Pro');
define('SERVICE_SLUG', 'sam-pro');
define('SERVICE_KEY', 'svc_sam-pro_39238b22faad');
define('SERVICE_ENDPOINT_PREFIX', '/business');

// Theme
define('THEME_COLOR', '#7c2d12');
define('THEME_COLOR_HOVER', '#681900');

// Site Info
define('SITE_TITLE', 'Sam Pro');
define('SITE_TAGLINE', 'Business intelligence and financial analysis');
define('SITE_DOMAIN', 'https://sam-pro.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_MARKET_ANALYSIS', 8);
define('CREDIT_COST_FINANCE_PLAN', 6);
define('CREDIT_COST_REPORT', 5);


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
