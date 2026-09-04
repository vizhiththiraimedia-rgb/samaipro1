<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Crypto Pro
// Auto-generated: 2026-09-04T02:56:26.382120
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Crypto Pro');
define('SERVICE_SLUG', 'sam-crypto');
define('SERVICE_KEY', 'sk-samai-crypto-test123abc456');
define('SERVICE_ENDPOINT_PREFIX', '/crypto');

// Theme
define('THEME_COLOR', '#14b8a8');
define('THEME_COLOR_HOVER', '#00a494');

// Site Info
define('SITE_TITLE', 'Sam Crypto Pro');
define('SITE_TAGLINE', 'Cryptocurrency market analysis and trading signals');
define('SITE_DOMAIN', 'https://crypto.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_MARKET', 1);
define('CREDIT_COST_NEWS', 1);
define('CREDIT_COST_ANALYZE', 3);


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
