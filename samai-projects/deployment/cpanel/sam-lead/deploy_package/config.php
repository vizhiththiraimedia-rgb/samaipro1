<?php
// =========================================================================
// SAM AI - Service Configuration: Sam LeadGen
// Auto-generated: 2026-09-05T03:42:25.718913
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam LeadGen');
define('SERVICE_SLUG', 'sam-lead');
define('SERVICE_KEY', 'svc_sam-lead_050a440e1329');
define('SERVICE_ENDPOINT_PREFIX', '/leads');

// Theme
define('THEME_COLOR', '#059669');
define('THEME_COLOR_HOVER', '#008255');

// Site Info
define('SITE_TITLE', 'Sam LeadGen');
define('SITE_TAGLINE', 'AI-powered lead generation and outreach');
define('SITE_DOMAIN', 'https://sam-lead.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_FIND', 5);
define('CREDIT_COST_SCRAPE', 3);


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
