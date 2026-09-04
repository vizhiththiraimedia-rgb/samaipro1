<?php
// =========================================================================
// SAM AI - Service Configuration
// COPY THIS FILE AND CUSTOMIZE FOR EACH STANDALONE SERVICE SITE
// =========================================================================

// --- Environment ---
define('ENVIRONMENT', 'production');

// --- Central API Connection ---
// This is ALWAYS the central API. Never change to the service domain.
define('SAMAI_API_BASE', 'https://samai.com');

// --- Service Identity ---
// Each standalone service gets its own API key from the admin panel.
// Generate one at: https://samai.com/admin/services
define('SERVICE_NAME', 'NewsFlash Pro');
define('SERVICE_SLUG', 'newsflash-pro');
define('SERVICE_KEY', 'sk-samai-REPLACE-WITH-REAL-KEY');
define('SERVICE_ENDPOINT_PREFIX', '/social-news');

// --- Theme ---
define('THEME_COLOR', '#ef4444');
define('THEME_COLOR_HOVER', '#dc2626');

// --- Site Info ---
define('SITE_TITLE', 'NewsFlash Pro');
define('SITE_TAGLINE', 'Generate AI-powered social media posts from any news URL');
define('SITE_DOMAIN', 'newsflash.ai');

// --- Endpoint Configuration ---
// These define the form fields and API calls available on the dashboard.
// Format: endpoint_name => [method, path, cost, params]
$SAMAI_ENDPOINTS = [
    'generate_post' => [
        'method' => 'POST',
        'path' => '/social-news/generate-post',
        'cost' => 2,
        'params' => [
            'url' => ['type' => 'url', 'required' => true, 'label' => 'News URL'],
            'language' => ['type' => 'select', 'required' => false, 'label' => 'Language', 'options' => [
                'en' => 'English', 'si' => 'Sinhala', 'ta' => 'Tamil', 'ta-in' => 'Tamil (India)'
            ]],
            'tone' => ['type' => 'select', 'required' => false, 'label' => 'Tone', 'options' => [
                'professional' => 'Professional', 'casual' => 'Casual', 'breaking' => 'Breaking News',
                'analytical' => 'Analytical', 'engaging' => 'Engaging'
            ]],
        ],
    ],
    'schedule' => [
        'method' => 'POST',
        'path' => '/social-news/schedule',
        'cost' => 1,
        'params' => [
            'platform' => ['type' => 'select', 'required' => true, 'label' => 'Platform', 'options' => [
                'twitter' => 'Twitter', 'facebook' => 'Facebook', 'linkedin' => 'LinkedIn', 'instagram' => 'Instagram'
            ]],
            'datetime' => ['type' => 'datetime', 'required' => true, 'label' => 'Schedule Time'],
        ],
    ],
    'trending' => [
        'method' => 'GET',
        'path' => '/social-news/trending',
        'cost' => 1,
        'params' => [],
    ],
];

// Primary action (first POST endpoint with cost > 0)
$SAMAI_PRIMARY_ENDPOINT = 'generate_post';
foreach ($SAMAI_ENDPOINTS as $name => $ep) {
    if ($ep['method'] === 'POST' && $ep['cost'] > 0) {
        $SAMAI_PRIMARY_ENDPOINT = $name;
        break;
    }
}
define('CREDIT_COST_PRIMARY', $SAMAI_ENDPOINTS[$SAMAI_PRIMARY_ENDPOINT]['cost']);

// --- Session Config ---
session_start();

// --- Auto-load API Client ---
require_once __DIR__ . '/includes/api-client.php';

// --- Initialize API Client ---
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

// --- Site-wide helper functions ---
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

function getEndpointField($field_name, $field_def) {
    $html = '';
    $type = $field_def['type'] ?? 'text';
    $label = $field_def['label'] ?? ucwords(str_replace('_', ' ', $field_name));
    $required = $field_def['required'] ?? false;
    $value = $field_def['default'] ?? '';

    $req_attr = $required ? ' required' : '';

    switch ($type) {
        case 'textarea':
            $html = "<textarea name=\"{$field_name}\" placeholder=\"{$label}\"{$req_attr}>{$value}</textarea>";
            break;
        case 'select':
            $options = $field_def['options'] ?? [];
            $html = "<select name=\"{$field_name}\"{$req_attr}>";
            foreach ($options as $val => $label) {
                $html .= "<option value=\"{$val}\">{$label}</option>";
            }
            $html .= "</select>";
            break;
        case 'number':
            $html = "<input type=\"number\" name=\"{$field_name}\" value=\"{$value}\" placeholder=\"{$label}\"{$req_attr}>";
            break;
        default:
            $html = "<input type=\"{$type}\" name=\"{$field_name}\" value=\"{$value}\" placeholder=\"{$label}\"{$req_attr}>";
    }

    return $html;
}
