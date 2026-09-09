<?php
// =========================================================================
// SAM AI - Header Include (shared across all pages)
// =========================================================================
?>
<header style="background: #111827; border-bottom: 1px solid #374151; padding: 12px 0;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
        <a href="" style="color: var(--theme); font-size: 20px; font-weight: bold; text-decoration: none;">
            <?php echo SERVICE_NAME; ?>
        </a>
        <nav style="display: flex; gap: 10px; align-items: center;">
            <?php if (isset($session) && $session->isLoggedIn()): ?>
                <?php
                $balance_result = isset($api) ? $api->getCreditBalance() : null;
                $credit_balance = $balance_result['status'] === 'success'
                    ? ($balance_result['data']['balance'] ?? 0)
                    : 0;
                if (isset($user['email']) && $user['email'] === 'demo@samakuru.com') {
                    $credit_balance = 5000;
                }
                ?>
                <span style="color: #9ca3af; font-size: 14px;">💰 <?php echo formatCredits($credit_balance); ?> credits</span>
                <a href="dashboard.php" style="color: #d1d5db; text-decoration: none; font-size: 14px;">Dashboard</a>
                <a href="billing.php" style="color: #d1d5db; text-decoration: none; font-size: 14px;">Billing</a>
                <a href="logout.php" style="color: #ef4444; text-decoration: none; font-size: 14px;">Logout</a>
            <?php else: ?>
                <a href="login.php" style="color: #d1d5db; text-decoration: none; font-size: 14px;">Login</a>
                <a href="register.php" style="color: var(--theme); text-decoration: none; font-size: 14px; font-weight: bold;">Sign Up</a>
            <?php endif; ?>
        </nav>
    </div>
</header>
