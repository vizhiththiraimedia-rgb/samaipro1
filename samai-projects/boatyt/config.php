<?php
// =========================================================================
// SAM AI - Service Configuration: BoatYT
// Auto-generated: 2026-09-05T03:42:26.254726
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'BoatYT');
define('SERVICE_SLUG', 'boatyt');
define('SERVICE_KEY', 'svc_boatyt_0cca251f1692');
define('SERVICE_ENDPOINT_PREFIX', '/media/video');

// Theme
define('THEME_COLOR', '#0ea5e9');
define('THEME_COLOR_HOVER', '#0091d5');

// Site Info
define('SITE_TITLE', 'BoatYT');
define('SITE_TAGLINE', 'YouTube boat content automation');
define('SITE_DOMAIN', 'https://boatyt.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_GENERATE_YT', 8);


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
