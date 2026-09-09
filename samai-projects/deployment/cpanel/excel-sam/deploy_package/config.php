<?php
// =========================================================================
// SAM AI - Service Configuration: Excel Sam
// Auto-generated: 2026-09-05T03:42:25.858363
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Excel Sam');
define('SERVICE_SLUG', 'excel-sam');
define('SERVICE_KEY', 'svc_excel-sam_ea80963b24f1');
define('SERVICE_ENDPOINT_PREFIX', '/analytics');

// Theme
define('THEME_COLOR', '#16a34a');
define('THEME_COLOR_HOVER', '#028f36');

// Site Info
define('SITE_TITLE', 'Excel Sam');
define('SITE_TAGLINE', 'AI-powered spreadsheet analysis and generation');
define('SITE_DOMAIN', 'https://excel-sam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_ANALYZE', 3);
define('CREDIT_COST_GENERATE', 2);


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
