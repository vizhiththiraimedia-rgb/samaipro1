<?php
// =========================================================================
// SAM AI - Service Configuration: Sam PDF Studio
// Auto-generated: 2026-09-05T03:42:25.654815
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam PDF Studio');
define('SERVICE_SLUG', 'sam-pdf');
define('SERVICE_KEY', 'svc_sam-pdf_f6838a6b84cf');
define('SERVICE_ENDPOINT_PREFIX', '/pdf-studio');

// Theme
define('THEME_COLOR', '#dc2626');
define('THEME_COLOR_HOVER', '#c81212');

// Site Info
define('SITE_TITLE', 'Sam PDF Studio');
define('SITE_TAGLINE', 'PDF processing, extraction, and editing');
define('SITE_DOMAIN', 'https://sam-pdf.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_EXTRACT', 2);
define('CREDIT_COST_SUMMARIZE', 3);
define('CREDIT_COST_TRANSLATE', 4);
define('CREDIT_COST_EDIT', 3);


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
