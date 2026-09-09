<?php
// =========================================================================
// SAM AI - Service Configuration: I-Tex
// Auto-generated: 2026-09-05T03:42:25.954136
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'I-Tex');
define('SERVICE_SLUG', 'itex-sam');
define('SERVICE_KEY', 'svc_itex-sam_b889248b8e49');
define('SERVICE_ENDPOINT_PREFIX', '/document');

// Theme
define('THEME_COLOR', '#475569');
define('THEME_COLOR_HOVER', '#334155');

// Site Info
define('SITE_TITLE', 'I-Tex');
define('SITE_TAGLINE', 'Text extraction and document intelligence');
define('SITE_DOMAIN', 'https://itex-sam.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_EXTRACT', 2);


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
