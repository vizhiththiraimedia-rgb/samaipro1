<?php
// =========================================================================
// SAM AI - Dynamic Dashboard Template
// Renders a form based on the service's endpoint config from config.php.
// No external file dependencies — works standalone on any cPanel.
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

$credit_cost = CREDIT_COST_PRIMARY;
$has_sufficient_credits = $credit_balance >= $credit_cost;

$primary = $SAMAI_ENDPOINTS[$SAMAI_PRIMARY_ENDPOINT] ?? null;
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

    if ($primary) {
        $endpoint = $primary['path'];
    } else {
        $endpoint = SERVICE_ENDPOINT_PREFIX . '/' . $SAMAI_PRIMARY_ENDPOINT;
    }

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
            <h2><?php echo $primary['path'] ?? 'Generate Content'; ?></h2>
            <?php if ($error): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <?php if ($primary && isset($primary['params'])): ?>
                    <?php foreach ($primary['params'] as $field_name => $field_def): ?>
                        <div class="form-group">
                            <label for="<?php echo $field_name; ?>">
                                <?php echo $field_def['label'] ?? ucwords(str_replace('_', ' ', $field_name)); ?>
                                <?php echo ($field_def['required'] ?? false) ? ' *' : ''; ?>
                            </label>
                            <?php echo getEndpointField($field_name, $field_def); ?>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="form-group">
                        <label for="prompt">Prompt *</label>
                        <textarea name="prompt" id="prompt" rows="4" required placeholder="Enter your request..."></textarea>
                    </div>
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
                    } elseif (isset($result['response'])) {
                        echo htmlspecialchars($result['response']);
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
