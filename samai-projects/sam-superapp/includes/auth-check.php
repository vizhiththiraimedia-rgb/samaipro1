<?php
// =========================================================================
// SAM AI - Authentication Check Middleware
// Include at the top of any page that requires authentication.
// Redirects to login if not authenticated, shows 402 page if no credits.
// =========================================================================

require_once __DIR__ . '/../config.php';

function requireAuth($api, $session) {
    if (!$session->isLoggedIn()) {
        redirect('login.php');
        exit;
    }

    $api->setToken($session->getToken());

    return $session->getUser();
}

function requireCredits($api, $session, $min_credits = 1) {
    $balance_result = $api->getCreditBalance();

    if ($balance_result['status'] === 'success') {
        $balance = $balance_result['data']['balance'] ?? 0;
        if ($balance < $min_credits) {
            return [
                'has_credits' => false,
                'balance' => $balance,
                'required' => $min_credits,
            ];
        }
        return [
            'has_credits' => true,
            'balance' => $balance,
            'required' => $min_credits,
        ];
    }

    if ($balance_result['status'] === 'payment_required') {
        return [
            'has_credits' => false,
            'balance' => $balance_result['current_balance'] ?? 0,
            'required' => $balance_result['cost_required'] ?? 1,
        ];
    }

    return [
        'has_credits' => true,
        'balance' => 0,
        'required' => $min_credits,
        'warning' => $balance_result['error'] ?? null,
    ];
}

function showPaymentRequired($balance, $required, $api_client) {
    $packs = $api_client->getCreditPacks();
    $credit_packs = $packs['status'] === 'success' ? ($packs['data']['packs'] ?? []) : [];

    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Required — <?php echo SITE_TITLE; ?></title>
        <link rel="stylesheet" href="assets/css/style.css">
        <style>
            .payment-required {
                text-align: center;
                padding: 60px 20px;
                max-width: 600px;
                margin: 0 auto;
            }
            .payment-required h1 { color: #ef4444; margin-bottom: 20px; }
            .payment-required .balance { font-size: 24px; font-weight: bold; color: #dc2626; }
            .credit-packs { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 30px 0; }
            .pack-card { background: #1f2937; border-radius: 10px; padding: 20px; text-align: center; border: 2px solid #374151; }
            .pack-card.popular { border-color: #ef4444; position: relative; }
            .pack-card.popular::before { content: "POPULAR"; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
            .pack-card .credits { font-size: 28px; font-weight: bold; color: #fff; }
            .pack-card .price { font-size: 16px; color: #9ca3af; margin: 5px 0; }
            .pack-card button { width: 100%; padding: 10px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="payment-required">
            <h1>Insufficient Credits</h1>
            <p>You need <span class="balance"><?php echo $required; ?> credits</span> to use this feature.</p>
            <p>Your current balance: <span class="balance"><?php echo formatCredits($balance); ?> credits</span></p>

            <h3>Purchase More Credits</h3>
            <div class="credit-packs">
                <?php foreach ($credit_packs as $pack): ?>
                    <div class="pack-card <?php echo $pack['credits'] == 120 ? 'popular' : ''; ?>">
                        <div class="credits"><?php echo $pack['credits']; ?>+</div>
                        <div class="price">$<?php echo $pack['price_usd']; ?> (LKR <?php echo number_format($pack['price_lk']); ?>)</div>
                        <button onclick="purchaseCredits(<?php echo $pack['credits']; ?>)">Buy Now</button>
                    </div>
                <?php endforeach; ?>
            </div>

            <p style="margin-top: 20px;"><a href="billing.php">← Back to Dashboard</a></p>
        </div>
    </body>
    </html>
    <?php
}
