<?php
// =========================================================================
// SAM AI - Master Marketplace Account Dashboard
// =========================================================================
session_start();

if (!isset($_SESSION['samai_user_session'])) {
    header('Location: /auth/login');
    exit;
}

$user = $_SESSION['samai_user_session']['user'] ?? [];
$jwt_token = $_SESSION['samai_user_session']['token'] ?? '';
$credits = $_SESSION['samai_user_session']['credits'] ?? 0;

// Fetch real-time data from API
$api_base = 'https://samai.com/api';
$service_key = getenv('SAMAI_MARKETPLACE_KEY') ?: 'svc_samai_lk_master';

$headers = [
    'Content-Type: application/json',
    'x-api-key: ' . $service_key,
    'Authorization: Bearer ' . $jwt_token,
];

// Get credit balance
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $api_base . '/services/credits/balance',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
]);
$balance_response = curl_exec($ch);
$balance_data = json_decode($balance_response, true);
if (isset($balance_data['data']['balance'])) {
    $credits = $balance_data['data']['balance'];
    $_SESSION['samai_user_session']['credits'] = $credits;
}
curl_close($ch);

// Get transaction history
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $api_base . '/services/credits/history?limit=30',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
]);
$history_response = curl_exec($ch);
$history_data = json_decode($history_response, true);
$transactions = $history_data['data']['transactions'] ?? [];
curl_close($ch);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account — SAM AI</title>
    <link rel="stylesheet" href="/assets/css/marketplace.css">
    <style>
        .account-page { padding: 40px 20px; }
        .account-container { max-width: 900px; margin: 0 auto; }
        .account-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .account-header h1 { font-size: 1.75rem; }
        .credit-card {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }
        .credit-card .balance { font-size: 3rem; font-weight: 800; color: var(--theme); }
        .credit-card .label { color: var(--text-tertiary); font-size: 14px; margin-top: 8px; }
        .btn-buy { background: var(--theme); color: white; padding: 12px 32px; border-radius: 8px; font-weight: 600; display: inline-block; margin-top: 16px; }
        .btn-buy:hover { background: var(--theme-hover); }
        .account-nav { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .account-nav a { padding: 10px 20px; background: var(--bg-secondary); border-radius: 8px; color: var(--text-secondary); font-size: 14px; border: 1px solid var(--border); }
        .account-nav a.active { background: var(--theme); color: white; border-color: var(--theme); }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid var(--border); font-size: 14px; }
        th { color: var(--text-tertiary); font-weight: 600; }
        td { color: var(--text-secondary); }
        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-success { background: #064e35; color: #6ee7b7; }
        .status-denied { background: #78350f; color: #fbbf24; }
        .logout-btn { background: #ef4444; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 600; }
        .logout-btn:hover { background: #dc2626; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <a href="/" class="logo">SAM AI</a>
            <nav>
                <a href="/account">Account</a>
                <a href="/pricing">Pricing</a>
            </nav>
        </div>
    </header>

    <div class="account-page">
        <div class="account-container">
            <div class="account-header">
                <h1>Account Dashboard</h1>
                <a href="/logout.php" class="logout-btn">Logout</a>
            </div>

            <div class="credit-card">
                <div class="balance"><?php echo number_format($credits); ?></div>
                <div class="label">Available Credits</div>
                <a href="/pricing" class="btn-buy">Buy More Credits</a>
            </div>

            <div class="account-nav">
                <a href="/account" class="active">Transactions</a>
                <a href="/account/services">My Services</a>
                <a href="/account/api-keys">API Keys</a>
            </div>

            <h2 style="color: var(--text-primary); margin-bottom: 15px;">Recent Transactions</h2>
            <?php if (empty($transactions)): ?>
                <p style="color: var(--text-tertiary);">No transactions yet. Purchase credits or start using services.</p>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Service</th>
                            <th>Endpoint</th>
                            <th>Credits</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($transactions as $tx): ?>
                            <tr>
                                <td><?php echo date('M j, H:i', strtotime($tx['created_at'] ?? 'now')); ?></td>
                                <td><?php echo htmlspecialchars($tx['service_name'] ?? '-'); ?></td>
                                <td><?php echo htmlspecialchars($tx['endpoint'] ?? '-'); ?></td>
                                <td><?php echo $tx['credits_used'] > 0 ? '-' . $tx['credits_used'] : '+' . abs($tx['amount'] ?? 0); ?></td>
                                <td>
                                    <span class="status-badge <?php echo $tx['status'] === 'success' ? 'status-success' : 'status-denied'; ?>">
                                        <?php echo htmlspecialchars($tx['status']); ?>
                                    </span>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
