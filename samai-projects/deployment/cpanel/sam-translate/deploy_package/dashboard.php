<?php
// =========================================================================
// SAM AI - Dynamic Dashboard Template
// This template renders a form based on the service's first non-free endpoint
// Customized per service by the deployment generator.
// =========================================================================
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth-check.php';

$user = requireAuth($api, $session);
$api->setToken($session->getToken());

// Get credit balance
$balance_result = $api->getCreditBalance();
$credit_balance = $balance_result['status'] === 'success'
    ? ($balance_result['data']['balance'] ?? 0)
    : 0;

// Load service config from registry
$registry_path = __DIR__ . '/../api_registry.json';
$registry = file_exists($registry_path) ? json_decode(file_get_contents($registry_path), true) : [];

$service_config = null;
foreach ($registry['services'] ?? [] as $svc) {
    if ($svc['service_slug'] === SERVICE_SLUG) {
        $service_config = $svc;
        break;
    }
}

// Get the first POST endpoint as the primary action
$primary_endpoint = null;
$credit_cost = 1;
foreach ($service_config['endpoints'] ?? [] as $ep) {
    if ($ep['method'] === 'POST' && $ep['cost_credits'] > 0) {
        $primary_endpoint = $ep;
        $credit_cost = $ep['cost_credits'];
        break;
    }
}

if (!$primary_endpoint) {
    $primary_endpoint = $service_config['endpoints'][0] ?? null;
    $credit_cost = $primary_endpoint['cost_credits'] ?? 0;
}

$has_sufficient_credits = $credit_balance >= $credit_cost;

$result = null;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['generate'])) {
    if (!$has_sufficient_credits) {
        ob_start();
        showPaymentRequired($credit_balance, $credit_cost, $api);
        exit;
    }

    // Build params from form data
    $params = [];
    foreach ($_POST as $key => $value) {
        if ($key !== 'generate') {
            $params[$key] = is_array($value) ? $value : trim($value);
        }
    }

    $endpoint = SERVICE_ENDPOINT_PREFIX . '/' . ($primary_endpoint['path'] ?? '');

    $api_result = $api->post($endpoint, $params);

    if ($api_result['status'] === 'success') {
        $result = $api_result['data'];
    } elseif ($api_result['status'] === 'payment_required') {
        ob_start();
        showPaymentRequired($api_result['current_balance'] ?? 0, $api_result['cost_required'], $api);
        exit;
    } else {
        $error = $api_result['error'] ?? 'API request failed.';
        $result = $api_result['data'] ?? null;
    }

    // Refresh credit balance
    $balance_result = $api->getCreditBalance();
    if ($balance_result['status'] === 'success') {
        $credit_balance = $balance_result['data']['balance'] ?? 0;
        $has_sufficient_credits = $credit_balance >= $credit_cost;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/service.css">
    <style>
        :root { --theme: <?php echo THEME_COLOR; ?>; --theme-hover: <?php echo THEME_COLOR_HOVER; ?>; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="dashboard">
        <div class="dashboard-header">
            <h1><?php echo SERVICE_NAME; ?> Dashboard</h1>
            <div class="credit-balance">
                Credits: <span class="credits"><?php echo formatCredits($credit_balance); ?></span>
                <a href="/billing.php" style="color: var(--theme); text-decoration: none; margin-left: 10px;">Buy More</a>
            </div>
        </div>

        <div class="dashboard-nav">
            <a href="/dashboard.php" class="active">Generate</a>
            <a href="/billing.php">Billing</a>
            <a href="/logout.php" style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px;">Logout</a>
        </div>

        <div class="form-section">
            <h2><?php echo $primary_endpoint['description'] ?? 'Generate Content'; ?></h2>
            <?php if ($error): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <?php if ($service_config): ?>
                    <?php foreach ($service_config['endpoints'] as $ep): ?>
                        <?php if ($ep['method'] !== 'POST'): continue; endif; ?>
                        <?php
                        $fields = $ep['params'] ?? [];
                        ?>
                        <?php if (!empty($fields)): ?>
                            <?php foreach ($fields as $field_name => $field_def): ?>
                                <?php
                                $field_type = 'text';
                                $field_label = ucwords(str_replace('_', ' ', $field_name));
                                $required = false;
                                $field_default = '';

                                $parts = explode(',', $field_def);
                                foreach ($parts as $part) {
                                    $part = trim($part);
                                    if ($part === 'required') $required = true;
                                    if (strpos($part, 'default=') === 0) {
                                        $field_default = substr($part, 7);
                                    }
                                    if (in_array($part, ['email', 'url'])) $field_type = $part;
                                }
                                ?>
                                <div class="form-group">
                                    <label for="<?php echo $field_name; ?>"><?php echo $field_label; ?><?php echo $required ? ' *' : ''; ?></label>
                                    <input type="<?php echo $field_type; ?>" id="<?php echo $field_name; ?>" name="<?php echo $field_name; ?>"
                                           value="<?php echo htmlspecialchars($field_default); ?>"
                                           <?php echo $required ? 'required' : ''; ?>
                                           placeholder="<?php echo $field_label; ?>">
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>

                        <!-- Show only the first POST endpoint's form -->
                        <?php break; ?>
                    <?php endforeach; ?>
                <?php endif; ?>

                <div class="form-group">
                    <label>Cost</label>
                    <input type="text" readonly style="background: #111827; color: var(--theme);" value="<?php echo $credit_cost; ?> credits">
                </div>

                <button type="submit" name="generate" class="btn-primary"
                        <?php echo !$has_sufficient_credits ? 'disabled' : ''; ?>>
                    <?php echo !$has_sufficient_credits ? 'Insufficient Credits' : 'Generate'; ?>
                </button>
            </form>
        </div>

        <?php if ($result): ?>
            <div class="result-section">
                <h2>Result</h2>
                <div class="result-content">
                    <?php
                    if (isset($result['post'])) {
                        echo htmlspecialchars($result['post']);
                    } elseif (isset($result['result'])) {
                        echo htmlspecialchars($result['result']);
                    } elseif (isset($result['content'])) {
                        echo htmlspecialchars($result['content']);
                    } elseif (isset($result['code'])) {
                        echo htmlspecialchars($result['code']);
                    } else {
                        echo htmlspecialchars(json_encode($result, JSON_PRETTY_PRINT));
                    }
                    ?>
                </div>
                <?php if (isset($result['image'])): ?>
                    <img src="<?php echo htmlspecialchars($result['image']); ?>" style="max-width:100%; border-radius: 8px; margin-top: 15px;">
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
