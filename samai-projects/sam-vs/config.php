<?php
// =========================================================================
// SAM AI - Service Configuration: Sam VS
// Auto-generated: 2026-09-05T03:42:26.051393
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam VS');
define('SERVICE_SLUG', 'sam-vs');
define('SERVICE_KEY', 'svc_sam-vs_d4e203d58f4e');
define('SERVICE_ENDPOINT_PREFIX', '/validation');

// Theme
define('THEME_COLOR', '#ef4444');
define('THEME_COLOR_HOVER', '#db3030');

// Site Info
define('SITE_TITLE', 'Sam VS');
define('SITE_TAGLINE', 'Output validation and quality assurance');
define('SITE_DOMAIN', 'https://sam-vs.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_VALIDATE', 1);


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
