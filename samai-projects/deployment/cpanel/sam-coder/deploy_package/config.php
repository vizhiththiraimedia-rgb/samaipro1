<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Coder
// Auto-generated: 2026-09-05T03:42:25.582335
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Coder');
define('SERVICE_SLUG', 'sam-coder');
define('SERVICE_KEY', 'svc_sam-coder_8dd8c9c7c87d');
define('SERVICE_ENDPOINT_PREFIX', '/coding');

// Theme
define('THEME_COLOR', '#3b82f6');
define('THEME_COLOR_HOVER', '#276ee2');

// Site Info
define('SITE_TITLE', 'Sam Coder');
define('SITE_TAGLINE', 'AI-powered code generation and review');
define('SITE_DOMAIN', 'https://sam-coder.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_GENERATE', 5);
define('CREDIT_COST_REVIEW', 3);
define('CREDIT_COST_FIX', 4);
define('CREDIT_COST_EXPLAIN', 3);


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
