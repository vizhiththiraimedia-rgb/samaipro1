<?php
// =========================================================================
// SAM AI - Master Marketplace (samai.lk)
// Main landing page listing all 35+ services
// =========================================================================

// Load service registry
$registry_path = __DIR__ . '/../api_registry.json';
$registry = file_exists($registry_path) ? json_decode(file_get_contents($registry_path), true) : [];

// Or load from the samai-projects directory
$registry_path = __DIR__ . '/../samai-projects/api_registry.json';
if (file_exists($registry_path)) {
    $registry = json_decode(file_get_contents($registry_path), true);
}

$services = $registry['services'] ?? [];

// Group services by cost tier
$free_services = [];
$standard_services = [];
$premium_services = [];

foreach ($services as $key => $svc) {
    $cost = $svc['cost_tier'] ?? 'standard';
    $item = [
        'key' => $key,
        'name' => $svc['service_name'],
        'slug' => $svc['service_slug'],
        'description' => $svc['description'],
        'theme_color' => $svc['theme_color'],
        'endpoint_prefix' => $svc['endpoint_prefix'],
    ];
    if ($cost === 'free') $free_services[] = $item;
    elseif ($cost === 'premium') $premium_services[] = $item;
    else $standard_services[] = $item;
}

// Check if user is logged in
session_start();
$is_logged_in = isset($_SESSION['samai_user_session']);
$user_email = $_SESSION['samai_user_session']['user']['email'] ?? null;
$credit_balance = $_SESSION['samai_user_session']['credits'] ?? 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAM AI — Central AI Services Hub</title>
    <meta name="description" content="SAM AI is a Personal AI Operating System offering 35+ specialized AI services. Chat, code, translate, generate images, analyze crypto, and more.">
    <link rel="icon" href="favicon.ico">
    <link rel="stylesheet" href="assets/css/marketplace.css">
    <style>
        :root {
            --theme: #3b82f6;
            --theme-hover: #2563eb;
            --theme-purple: #8b5cf6;
            --theme-red: #ef4444;
            --theme-green: #10b981;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <a href="index.php" class="logo">SAM AI</a>
            <nav>
                <a href="#services">All Services</a>
                <a href="pricing.php">Pricing</a>
                <?php if ($is_logged_in): ?>
                    <a href="account.php">Account (<?php echo htmlspecialchars($user_email); ?>)</a>
                    <span class="credits">💰 <?php echo number_format($credit_balance); ?> credits</span>
                <?php else: ?>
                    <a href="auth/login.php" class="btn btn-sm">Login</a>
                    <a href="auth/register.php" class="btn btn-sm btn-primary">Sign Up</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Personal AI Operating System</h1>
            <p class="subtitle">35+ specialized AI services — one account, pay-per-use credits. No subscriptions.</p>
            <div class="hero-buttons">
                <a href="auth/register.php" class="btn btn-primary-lg">Get Started — 50 Free Credits</a>
                <a href="#services" class="btn btn-secondary-lg">Browse Services</a>
            </div>
            <div class="providers">
                <span>Powered by:</span>
                <span class="provider">Gemini</span>
                <span class="provider">Claude</span>
                <span class="provider">OpenAI</span>
                <span class="provider">Groq</span>
                <span class="provider">OpenRouter</span>
            </div>
        </div>
    </section>

    <section id="services" class="services-section">
        <div class="container">
            <h2>All AI Services</h2>
            <p class="section-subtitle">Each service is a standalone site with its own login, dashboard, and payment system.</p>

            <div class="service-categories">
                <button class="category-btn active" data-category="all">All Services (<?php echo count($services); ?>)</button>
                <button class="category-btn" data-category="premium">Premium</button>
                <button class="category-btn" data-category="standard">Standard</button>
                <button class="category-btn" data-category="free">Free</button>
            </div>

            <div class="services-grid" id="services-grid">
                <?php foreach ($services as $key => $svc): ?>
                    <?php $color = $svc['theme_color'] ?? '#3b82f6'; ?>
                    <div class="service-card" data-category="<?php echo $svc['cost_tier'] ?? 'standard'; ?>">
                        <div class="service-header" style="background: <?php echo $color; ?>20;">
                            <div class="service-icon" style="color: <?php echo $color; ?>;">
                                <?php echo strtoupper(substr($svc['service_name'], 0, 1)); ?>
                            </div>
                            <div class="service-info">
                                <h3><?php echo htmlspecialchars($svc['service_name']); ?></h3>
                                <span class="service-tier tier-<?php echo $svc['cost_tier'] ?? 'standard'; ?>">
                                    <?php echo ucfirst($svc['cost_tier'] ?? 'standard'); ?>
                                </span>
                            </div>
                        </div>
                        <div class="service-body">
                            <p class="service-desc"><?php echo htmlspecialchars($svc['description']); ?></p>
                            <div class="service-endpoints">
                                <?php foreach ($svc['endpoints'] as $ep): ?>
                                    <span class="endpoint-tag"><?php echo $ep['name']; ?> • <?php echo $ep['cost_credits']; ?>cr</span>
                                <?php endforeach; ?>
                            </div>
                            <a href="https://<?php echo $svc['service_slug']; ?>.sam.ai" class="btn btn-service" style="background: <?php echo $color; ?>;">
                                Open <?php echo htmlspecialchars($svc['service_name']); ?>
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="how-it-works">
        <div class="container">
            <h2>How It Works</h2>
            <div class="steps-3">
                <div class="step">
                    <div class="step-num">1</div>
                    <h3>Create Account</h3>
                    <p>Sign up once with your email. Get 50 free credits to try any service.</p>
                </div>
                <div class="step">
                    <h3>Use Any Service</h3>
                    <p>Each service has its own standalone site. Use credits to power AI operations.</p>
                </div>
                <div class="step">
                    <div class="step-num">3</div>
                    <h3>Pay As You Go</h3>
                    <p>No subscriptions. Buy credit packs as needed. Credits work across all services.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="credit-packs-preview">
        <div class="container">
            <h2>Credit Packs</h2>
            <div class="packs-grid">
                <div class="pack-card">
                    <div class="credits">50 credits</div>
                    <div class="price">$5</div>
                </div>
                <div class="pack-card popular">
                    <div class="badge">BEST VALUE</div>
                    <div class="credits">120+10 credits</div>
                    <div class="price">$10</div>
                </div>
                <div class="pack-card">
                    <div class="credits">350+50 credits</div>
                    <div class="price">$25</div>
                </div>
                <div class="pack-card">
                    <div class="credits">1,800+400 credits</div>
                    <div class="price">$100</div>
                </div>
            </div>
            <a href="/pricing" class="btn btn-primary-lg">View All Packs</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> SAM AI — Central AI Services Hub</p>
            <p><a href="https://samai.com/docs">API Documentation</a> | <a href="https://samai.com/privacy">Privacy</a> | <a href="https://samai.com/contact">Contact</a></p>
        </div>
    </footer>

    <script>
        // Filter services by category
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelector('.category-btn.active').classList.remove('active');
                this.classList.add('active');
                const category = this.dataset.category;
                document.querySelectorAll('.service-card').forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    </script>
</body>
</html>
