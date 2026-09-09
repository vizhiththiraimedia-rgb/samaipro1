<?php
// =========================================================================
// SAM AI - Service Configuration: Sam Learn & Cues
// Auto-generated: 2026-09-05T03:42:25.732536
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam Learn & Cues');
define('SERVICE_SLUG', 'sam-learn');
define('SERVICE_KEY', 'svc_sam-learn_f3aaad72eccd');
define('SERVICE_ENDPOINT_PREFIX', '/learning');

// Theme
define('THEME_COLOR', '#2563eb');
define('THEME_COLOR_HOVER', '#114fd7');

// Site Info
define('SITE_TITLE', 'Sam Learn & Cues');
define('SITE_TAGLINE', 'Personalized learning and tutoring');
define('SITE_DOMAIN', 'https://sam-learn.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_EXPLAIN', 2);
define('CREDIT_COST_QUIZ', 1);
define('CREDIT_COST_TUTOR', 3);


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
