<?php
// =========================================================================
// SAM AI - Standalone Service Billing Page
// Purchase credit packs and view transaction history
// =========================================================================
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth-check.php';

$user = requireAuth($api, $session);
$api->setToken($session->getToken());

$action = $_GET['action'] ?? 'list';
$message = $_GET['msg'] ?? '';

// Get current credit balance
$balance_result = $api->getCreditBalance();
$credit_balance = $balance_result['status'] === 'success'
    ? ($balance_result['data']['balance'] ?? 0)
    : 0;

// Get available credit packs
$packs_result = $api->getCreditPacks();
$credit_packs = $packs_result['status'] === 'success'
    ? ($packs_result['data']['packs'] ?? [])
    : [];

// Get transaction history
$history_result = $api->getCreditHistory(50);
$transactions = $history_result['status'] === 'success'
    ? ($history_result['data']['transactions'] ?? [])
    : [];

// Process purchase
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['purchase'])) {
    $pack_credits = intval($_POST['pack'] ?? 0);

    if ($pack_credits > 0) {
        $purchase_result = $api->post('/services/credits/purchase', [
            'credit_pack' => $pack_credits,
        ]);

        if ($purchase_result['status'] === 'success') {
            $checkout_url = $purchase_result['data']['checkout_url'] ?? '/billing.php';
            redirect($checkout_url);
        } else {
            $message = $purchase_result['error'] ?? 'Purchase failed';
        }

        // Refresh balance
        $balance_result = $api->getCreditBalance();
        $credit_balance = $balance_result['status'] === 'success'
            ? ($balance_result['data']['balance'] ?? 0)
            : 0;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billing — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        :root { --theme: <?php echo THEME_COLOR; ?>; --theme-hover: <?php echo THEME_COLOR_HOVER; ?>; }
        .billing-page { max-width: 900px; margin: 0 auto; padding: 30px 20px; }
        .billing-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .credit-balance { background: #1f2937; border-radius: 8px; padding: 8px 16px; font-size: 14px; }
        .credit-balance .credits { font-weight: bold; color: var(--theme); }
        .dashboard-nav { display: flex; gap: 10px; margin-bottom: 20px; }
        .dashboard-nav a { padding: 8px 16px; background: #374151; border-radius: 6px; text-decoration: none; color: #d1d5db; font-size: 14px; }
        .dashboard-nav a.active { background: var(--theme); color: white; }
        .credit-packs { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0; }
        .pack-card { background: #1f2937; border-radius: 12px; padding: 30px; text-align: center; border: 2px solid #374151; transition: border-color 0.2s; }
        .pack-card:hover { border-color: var(--theme); }
        .pack-card.popular { border-color: var(--theme); position: relative; }
        .pack-card.popular::before { content: "BEST VALUE"; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--theme); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .pack-card .credits { font-size: 32px; font-weight: bold; color: #fff; margin-bottom: 10px; }
        .pack-card .price { font-size: 20px; color: var(--theme); font-weight: bold; margin: 10px 0; }
        .pack-card .bonus { font-size: 12px; color: #6ee7b7; margin: 5px 0; }
        .pack-card .per-credit { font-size: 12px; color: #9ca3af; margin-bottom: 15px; }
        .pack-card button { width: 100%; padding: 12px; background: var(--theme); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; }
        .pack-card button:hover { background: var(--theme-hover); }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #374151; font-size: 14px; }
        th { color: #9ca3af; font-weight: 600; }
        td { color: #d1d5db; }
        .status-success { color: #6ee7b7; }
        .status-error { color: #fca5a5; }
        .status-denied { color: #fbbf24; }
        .message { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .message-success { background: #064e35; color: #6ee7b7; }
        .message-error { background: #7f1d1d; color: #fecaca; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="billing-page">
        <div class="billing-header">
            <h1>Billing & Credits</h1>
            <div class="credit-balance">
                Balance: <span class="credits"><?php echo formatCredits($credit_balance); ?> credits</span>
            </div>
        </div>

        <div class="dashboard-nav">
            <a href="/dashboard.php" class="active">Dashboard</a>
            <a href="/billing.php">Billing</a>
            <a href="/logout.php">Logout</a>
        </div>

        <?php if ($message): ?>
            <div class="message <?php echo strpos($message, 'success') !== false ? 'message-success' : 'message-error'; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <h2 style="color: #fff; margin-bottom: 15px;">Purchase Credits</h2>
        <p style="color: #9ca3af; margin-bottom: 20px; font-size: 14px;">
            Each credit lets you use AI-powered features. Prices shown in USD and LKR.
        </p>

        <div class="credit-packs">
            <?php foreach ($credit_packs as $pack): ?>
                <div class="pack-card <?php echo $pack['credits'] == 120 ? 'popular' : ''; ?>">
                    <div class="credits"><?php echo $pack['credits']; ?>+</div>
                    <?php if (isset($pack['bonus']) && $pack['bonus'] > 0): ?>
                        <div class="bonus">+<?php echo $pack['bonus']; ?> bonus credits</div>
                    <?php endif; ?>
                    <div class="price">$<?php echo $pack['price_usd']; ?> / LKR <?php echo number_format($pack['price_lk']); ?></div>
                    <div class="per-credit">$<?php echo round($pack['price_usd'] / $pack['credits'], 4); ?>/credit</div>
                    <form method="POST" style="display: inline;">
                        <input type="hidden" name="pack" value="<?php echo $pack['credits']; ?>">
                        <button type="submit" name="purchase">Purchase</button>
                    </form>
                </div>
            <?php endforeach; ?>
        </div>

        <h2 style="color: #fff; margin: 30px 0 15px;">Transaction History</h2>
        <?php if (empty($transactions)): ?>
            <p style="color: #9ca3af;">No transactions yet.</p>
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
                            <td><?php echo date('M j, Y', strtotime($tx['created_at'] ?? 'now')); ?></td>
                            <td><?php echo htmlspecialchars($tx['service_name'] ?? '-'); ?></td>
                            <td><?php echo htmlspecialchars($tx['endpoint'] ?? '-'); ?></td>
                            <td><?php echo $tx['credits_used'] > 0 ? '-' . $tx['credits_used'] : '+' . abs($tx['amount']); ?></td>
                            <td>
                                <span class="
                                    <?php echo $tx['status'] === 'success' ? 'status-success' : ($tx['status'] === 'denied_insufficient_funds' ? 'status-denied' : 'status-error'); ?>">
                                    <?php echo htmlspecialchars($tx['status']); ?>
                                </span>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
