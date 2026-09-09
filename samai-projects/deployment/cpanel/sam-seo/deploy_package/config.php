<?php
// =========================================================================
// SAM AI - Service Configuration: Sam SEO Pro
// Auto-generated: 2026-09-05T03:42:25.759897
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam SEO Pro');
define('SERVICE_SLUG', 'sam-seo');
define('SERVICE_KEY', 'svc_sam-seo_d7152275c6c1');
define('SERVICE_ENDPOINT_PREFIX', '/seo');

// Theme
define('THEME_COLOR', '#16a34a');
define('THEME_COLOR_HOVER', '#028f36');

// Site Info
define('SITE_TITLE', 'Sam SEO Pro');
define('SITE_TAGLINE', 'SEO optimization and keyword research');
define('SITE_DOMAIN', 'https://sam-seo.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_ANALYZE', 3);
define('CREDIT_COST_KEYWORDS', 2);
define('CREDIT_COST_CONTENT', 2);


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
