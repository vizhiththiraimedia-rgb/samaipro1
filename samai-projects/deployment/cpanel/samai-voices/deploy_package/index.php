<?php
// =========================================================================
// SAM AI - Standalone Service Homepage Template
// Customize this per service by changing config.php
// =========================================================================
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth-check.php';

$user = null;
$credit_balance = 0;

if ($session->isLoggedIn()) {
    $user = $session->getUser();
    $api->setToken($session->getToken());
    $balance_result = $api->getCreditBalance();
    if ($balance_result['status'] === 'success') {
        $credit_balance = $balance_result['data']['balance'] ?? 0;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_TITLE; ?></title>
    <meta name="description" content="<?php echo SITE_TAGLINE; ?>">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/service.css">
    <style>
        :root {
            --theme: <?php echo THEME_COLOR; ?>;
            --theme-hover: <?php echo THEME_COLOR_HOVER; ?>;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <a href="/" class="logo"><?php echo SERVICE_NAME; ?></a>
            <nav>
                <a href="/dashboard.php">Dashboard</a>
                <a href="/billing.php">Billing</a>
                <?php if ($session->isLoggedIn()): ?>
                    <a href="/logout.php">Logout (<?php echo htmlspecialchars($user['email'] ?? 'user'); ?>)</a>
                <?php else: ?>
                    <a href="/login.php">Login</a>
                    <a href="/register.php">Sign Up</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <main class="hero-section">
        <div class="container">
            <h1><?php echo SITE_TAGLINE; ?></h1>
            <p class="subtitle">Powered by <a href="https://samai.com">SAM AI</a></p>

            <?php if ($session->isLoggedIn()): ?>
                <div class="credit-badge">
                    You have <strong><?php echo formatCredits($credit_balance); ?> credits</strong> available
                </div>
            <?php else: ?>
                <div class="hero-buttons">
                    <a href="/register.php" class="btn btn-primary">Get Started — Sign Up</a>
                    <a href="/login.php" class="btn btn-secondary">Already have an account?</a>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <section class="features-section">
        <div class="container">
            <h2>Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>Fast & Accurate</h3>
                    <p>Generate professional content in seconds using cutting-edge AI models.</p>
                </div>
                <div class="feature-card">
                    <h3>Pay-Per-Use</h3>
                    <p>Only pay credits for what you use. No subscriptions or hidden fees.</p>
                </div>
                <div class="feature-card">
                    <h3>Privacy First</h3>
                    <p>Your data never leaves our servers. All processing is encrypted.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="pricing-preview">
        <div class="container">
            <h2>How It Works</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-num">1</div>
                    <h4>Sign Up</h4>
                    <p>Create an account in seconds.</p>
                </div>
                <div class="step">
                    <div class="step-num">2</div>
                    <h4>Purchase Credits</h4>
                    <p>Buy a credit pack starting at $5.</p>
                </div>
                <div class="step">
                    <div class="step-num">3</div>
                    <h4>Use the AI</h4>
                    <p>Each action deducts a small number of credits.</p>
                </div>
            </div>
            <a href="/register.php" class="btn btn-primary">Start Now</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> <?php echo SERVICE_NAME; ?> — Powered by SAM AI</p>
            <p><a href="https://samai.com">Visit samai.com for all services</a></p>
        </div>
    </div>
</body>
</html>
