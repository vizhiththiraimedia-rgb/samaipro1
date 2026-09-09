<?php
// =========================================================================
// SAM AI - Service Configuration: TS Holdings
// Auto-generated: 2026-09-05T03:42:26.105059
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'TS Holdings');
define('SERVICE_SLUG', 'holdingsam');
define('SERVICE_KEY', 'svc_holdingsam_f156bba8ef7d');
define('SERVICE_ENDPOINT_PREFIX', '/knowledge');

// Theme
define('THEME_COLOR', '#1e293b');
define('THEME_COLOR_HOVER', '#0a1527');

// Site Info
define('SITE_TITLE', 'TS Holdings');
define('SITE_TAGLINE', 'Corporate knowledge and holdings portal');
define('SITE_DOMAIN', 'https://holdingsam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_INTERNAL_SEARCH', 2);


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
