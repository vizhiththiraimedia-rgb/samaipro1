<?php
// =========================================================================
// SAM AI - Service Configuration: Sam FullStack Builder
// Auto-generated: 2026-09-09T12:35:52.030398
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', 'Sam FullStack Builder');
define('SERVICE_SLUG', 'sam-fullstack');
define('SERVICE_KEY', 'sk-samai-dummykey');
define('SERVICE_ENDPOINT_PREFIX', '/fullstack');

// Theme
define('THEME_COLOR', '#0f172a');
define('THEME_COLOR_HOVER', '#000316');

// Site Info
define('SITE_TITLE', 'Sam FullStack Builder');
define('SITE_TAGLINE', 'Full-stack web application development with Next.js, TypeScript, PostgreSQL, and automated deployment');
define('SITE_DOMAIN', 'https://sam-fullstack.sam.ai');

// Credit Costs (from api_registry.json)
define('CREDIT_COST_PLAN', 3);
define('CREDIT_COST_SCAFFOLD', 25);
define('CREDIT_COST_FRONTEND', 10);
define('CREDIT_COST_BACKEND', 10);
define('CREDIT_COST_DATABASE', 8);
define('CREDIT_COST_AUTH', 8);
define('CREDIT_COST_ADMIN', 12);
define('CREDIT_COST_DEPLOY', 6);

// --- Endpoint Definitions (used by dashboard.php for rendering forms) ---
$SAMAI_ENDPOINTS = [
    'plan' => [
        'method' => 'POST',
        'path' => '/fullstack/plan',
        'cost' => 3,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe your project'],
            'target_audience' => ['type' => 'select', 'required' => false, 'label' => 'Target Audience', 'options' => [
                'general' => 'General', 'enterprise' => 'Enterprise', 'startup' => 'Startup', 'small_business' => 'Small Business'
            ]],
        ],
    ],
    'scaffold' => [
        'method' => 'POST',
        'path' => '/fullstack/scaffold',
        'cost' => 25,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe your full application'],
            'stack' => ['type' => 'select', 'required' => false, 'label' => 'Tech Stack', 'options' => [
                'nextjs-postgresql' => 'Next.js + PostgreSQL',
                'nextjs-mysql' => 'Next.js + MySQL',
                'nextjs-mongodb' => 'Next.js + MongoDB',
            ]],
            'features' => ['type' => 'text', 'required' => false, 'label' => 'Key Features (comma-separated)'],
        ],
    ],
    'frontend' => [
        'method' => 'POST',
        'path' => '/fullstack/frontend',
        'cost' => 10,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe the frontend/UI'],
            'pages' => ['type' => 'number', 'required' => false, 'label' => 'Number of Pages', 'default' => 3],
            'theme' => ['type' => 'select', 'required' => false, 'label' => 'Theme', 'options' => [
                'dark' => 'Dark', 'light' => 'Light', 'auto' => 'Auto (System)'
            ]],
        ],
    ],
    'backend' => [
        'method' => 'POST',
        'path' => '/fullstack/backend',
        'cost' => 10,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe the backend/API'],
            'endpoints' => ['type' => 'text', 'required' => false, 'label' => 'Endpoints (comma-separated)'],
            'database' => ['type' => 'select', 'required' => false, 'label' => 'Database', 'options' => [
                'postgresql' => 'PostgreSQL', 'mysql' => 'MySQL', 'mongodb' => 'MongoDB'
            ]],
        ],
    ],
    'database' => [
        'method' => 'POST',
        'path' => '/fullstack/database',
        'cost' => 8,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe your data model'],
            'engine' => ['type' => 'select', 'required' => false, 'label' => 'Database Engine', 'options' => [
                'postgresql' => 'PostgreSQL', 'mysql' => 'MySQL', 'mongodb' => 'MongoDB'
            ]],
            'tables' => ['type' => 'text', 'required' => false, 'label' => 'Table names (comma-separated)'],
        ],
    ],
    'auth' => [
        'method' => 'POST',
        'path' => '/fullstack/auth',
        'cost' => 8,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe auth requirements'],
            'provider' => ['type' => 'select', 'required' => false, 'label' => 'Auth Provider', 'options' => [
                'jwt' => 'JWT', 'oauth' => 'OAuth 2.0', 'nextauth' => 'NextAuth.js', 'custom' => 'Custom'
            ]],
            'roles' => ['type' => 'text', 'required' => false, 'label' => 'Roles (comma-separated)'],
        ],
    ],
    'admin' => [
        'method' => 'POST',
        'path' => '/fullstack/admin',
        'cost' => 12,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe admin dashboard'],
            'model' => ['type' => 'text', 'required' => false, 'label' => 'Primary Model', 'default' => 'Admin'],
        ],
    ],
    'deploy' => [
        'method' => 'POST',
        'path' => '/fullstack/deploy',
        'cost' => 6,
        'params' => [
            'prompt' => ['type' => 'textarea', 'required' => true, 'label' => 'Describe deployment setup'],
            'platform' => ['type' => 'select', 'required' => false, 'label' => 'Deployment Platform', 'options' => [
                'vercel' => 'Vercel', 'vps' => 'VPS (cPanel)', 'aws' => 'AWS', 'docker' => 'Docker'
            ]],
        ],
    ],
];

// Primary action endpoint (first POST endpoint with cost > 0)
$SAMAI_PRIMARY_ENDPOINT = 'scaffold';
define('CREDIT_COST_PRIMARY', $SAMAI_ENDPOINTS[$SAMAI_PRIMARY_ENDPOINT]['cost']);


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
            foreach ($options as $val => $lbl) {
                $html .= "<option value=\"{$val}\">{$lbl}</option>";
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
?>
