<?php
// =========================================================================
// SAM AI - Service Configuration: Plan Sam
// Auto-generated: 2026-09-05T03:42:26.010556
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Plan Sam');
define('SERVICE_SLUG', 'plan-sam');
define('SERVICE_KEY', 'svc_plan-sam_28d68c34f94a');
define('SERVICE_ENDPOINT_PREFIX', '/plan');

// Theme
define('THEME_COLOR', '#0f172a');
define('THEME_COLOR_HOVER', '#000316');

// Site Info
define('SITE_TITLE', 'Plan Sam');
define('SITE_TAGLINE', 'Task planning and project decomposition');
define('SITE_DOMAIN', 'https://plan-sam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_DECOMPOSE', 2);
define('CREDIT_COST_TIMELINE', 2);


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
