<?php
// =========================================================================
// SAM AI - Service Configuration: SAM AI MIDI Editor
// Auto-generated: 2026-09-05T14:07:37.401633
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'SAM AI MIDI Editor');
define('SERVICE_SLUG', 'samai-midi');
define('SERVICE_KEY', 'svc_samai-midi_cafef00d9988');
define('SERVICE_ENDPOINT_PREFIX', '/music/midi');

// Theme
define('THEME_COLOR', '#a855f7');
define('THEME_COLOR_HOVER', '#9441e3');

// Site Info
define('SITE_TITLE', 'SAM AI MIDI Editor');
define('SITE_TAGLINE', 'AI-powered MIDI composition and editing with piano roll');
define('SITE_DOMAIN', 'samai-midi.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_COMPOSE_MIDI', 4);
define('CREDIT_COST_EXPORT_MIDI', 0);


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
