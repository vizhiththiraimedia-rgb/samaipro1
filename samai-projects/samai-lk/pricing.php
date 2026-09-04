<?php
// =========================================================================
// SAM AI - Master Marketplace Pricing Page (samai.lk/pricing)
// =========================================================================
session_start();
$is_logged_in = isset($_SESSION['samai_user_session']);
$user_email = $_SESSION['samai_user_session']['user']['email'] ?? null;

// Fetch credit packs from API
$api_base = 'https://samai.com/api';
$service_key = getenv('SAMAI_MARKETPLACE_KEY') ?: 'svc_samai_lk_master';

$packs = [
    ['credits' => 50, 'bonus' => 0, 'price_usd' => 5, 'price_lk' => 1500, 'badge' => ''],
    ['credits' => 130, 'bonus' => 10, 'price_usd' => 10, 'price_lk' => 3000, 'badge' => 'popular'],
    ['credits' => 400, 'bonus' => 50, 'price_usd' => 25, 'price_lk' => 7500, 'badge' => ''],
    ['credits' => 950, 'bonus' => 150, 'price_usd' => 55, 'price_lk' => 16500, 'badge' => 'best'],
    ['credits' => 2200, 'bonus' => 400, 'price_usd' => 100, 'price_lk' => 30000, 'badge' => 'enterprise'],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pricing — SAM AI</title>
    <meta name="description" content="SAM AI credit-based pricing. Buy credits starting at $5 for 50 credits. Use across all 35+ AI services.">
    <link rel="stylesheet" href="/assets/css/marketplace.css">
</head>
<body>
    <header>
        <div class="container">
            <a href="/" class="logo">SAM AI</a>
            <nav>
                <a href="/">Home</a>
                <a href="/pricing">Pricing</a>
                <a href="/docs">API Docs</a>
                <?php if ($is_logged_in): ?>
                    <a href="/account">Account</a>
                    <span class="credits">💰 <?php echo number_format($_SESSION['samai_user_session']['credits'] ?? 0); ?> credits</span>
                <?php else: ?>
                    <a href="/auth/login" class="btn btn-sm">Login</a>
                    <a href="/auth/register" class="btn btn-sm btn-primary">Sign Up</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <section class="hero" style="padding: 80px 20px; text-align: center;">
        <div class="container">
            <h1 style="font-size: clamp(2rem, 4vw, 3rem);">Simple, Pay-As-You-Go Pricing</h1>
            <p class="subtitle" style="max-width: 640px; margin: 0 auto 40px;">
                No subscriptions. No hidden fees. Buy credits once and use them across all 35+ AI services.
                Each service deducts credits per API call based on complexity.
            </p>
        </div>
    </section>

    <section class="credit-packs-preview" style="padding: 40px 20px;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 10px;">Credit Packs</h2>
            <p style="text-align: center; color: var(--text-secondary); margin-bottom: 40px;">
                Credits never expire. Starting at $0.10/credit.
            </p>

            <div class="packs-grid">
                <?php foreach ($packs as $pack): ?>
                    <div class="pack-card <?php echo $pack['badge']; ?>">
                        <?php if ($pack['badge'] === 'popular'): ?>
                            <div class="badge">BEST VALUE</div>
                        <?php endif; ?>
                        <?php if ($pack['badge'] === 'enterprise'): ?>
                            <div class="badge">ENTERPRISE</div>
                        <?php endif; ?>
                        <div class="credits"><?php echo $pack['credits']; ?>+</div>
                        <?php if ($pack['bonus'] > 0): ?>
                            <div style="color: #6ee7b7; font-size: 13px; margin-bottom: 8px;">
                                +<?php echo $pack['bonus']; ?> bonus credits
                            </div>
                        <?php endif; ?>
                        <div class="price">$<?php echo $pack['price_usd']; ?></div>
                        <div style="color: var(--text-tertiary); font-size: 13px; margin: 8px 0;">
                            LKR <?php echo number_format($pack['price_lk']); ?>
                        </div>
                        <div style="color: var(--text-tertiary); font-size: 12px; margin-bottom: 16px;">
                            $<?php echo round($pack['price_usd'] / $pack['credits'], 3); ?>/credit
                        </div>
                        <?php if ($is_logged_in): ?>
                            <form method="POST" action="/pay/stripe">
                                <input type="hidden" name="pack_id" value="<?php echo $pack['credits']; ?>">
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Purchase
                                </button>
                            </form>
                        <?php else: ?>
                            <a href="/auth/register?redirect=/pricing" class="btn btn-primary" style="width: 100%;">
                                Buy Now
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <div style="margin-top: 40px; text-align: center;">
                <p style="color: var(--text-tertiary); font-size: 14px; margin-bottom: 10px;">
                    💡 New users get 50 free credits on sign up
                </p>
                <?php if (!$is_logged_in): ?>
                    <a href="/auth/register" class="btn btn-primary">Create Account & Get Free Credits</a>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <section class="how-it-works" style="padding: 40px 20px;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 30px;">Pricing FAQ</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="border-bottom: 1px solid var(--border); padding: 20px 0;">
                    <h3 style="color: var(--theme);">Do credits expire?</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">No, credits never expire as long as your account is active. We recommend using them within 12 months.</p>
                </div>
                <div style="border-bottom: 1px solid var(--border); padding: 20px 0;">
                    <h3 style="color: var(--theme);">Can I use credits across services?</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Yes! Credits are shared across all 35+ SAM AI services. No need to buy separate credits per service.</p>
                </div>
                <div style="border-bottom: 1px solid var(--border); padding: 20px 0;">
                    <h3 style="color: var(--theme);">What payment methods do you accept?</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">We accept Stripe (credit/debit cards globally) and local bank transfers for Sri Lankan customers.</p>
                </div>
                <div style="padding: 20px 0;">
                    <h3 style="color: var(--theme);">Do you offer enterprise plans?</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Yes, contact us at <a href="mailto:enterprise@samai.com" style="color: var(--theme);">enterprise@samai.com</a> for custom plans and dedicated support.</p>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> SAM AI — Pricing</p>
            <p><a href="/">Home</a> | <a href="/privacy">Privacy</a> | <a href="/terms">Terms</a></p>
        </div>
    </footer>
</body>
</html>
