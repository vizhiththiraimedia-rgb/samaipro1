<?php
// =========================================================================
// SAM AI - Sam FullStack Builder - Landing Page
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

$stages = [
    ['key' => 'plan',       'title' => 'Requirements & Planning',      'desc' => 'Analyze requirements, plan features & architecture',           'cost' => 3,  'icon' => 'fa-solid fa-magnifying-glass-chart'],
    ['key' => 'scaffold',   'title' => 'Project Scaffold',              'desc' => 'Generate complete project structure & codebase',               'cost' => 25, 'icon' => 'fa-solid fa-cube', 'badge' => 'premium'],
    ['key' => 'frontend',   'title' => 'Frontend Development',           'desc' => 'Next.js + TypeScript + Tailwind responsive UI',                'cost' => 10, 'icon' => 'fa-brands fa-js'],
    ['key' => 'backend',    'title' => 'Backend & API',                  'desc' => 'Node.js/Next.js API routes & server logic',                     'cost' => 10, 'icon' => 'fa-solid fa-server'],
    ['key' => 'database',   'title' => 'Database Design',                'desc' => 'PostgreSQL/MySQL schema, models & migrations',                'cost' => 8,  'icon' => 'fa-solid fa-database'],
    ['key' => 'auth',       'title' => 'Authentication & Security',      'desc' => 'JWT/OAuth, RBAC, sessions & API security',                       'cost' => 8,  'icon' => 'fa-solid fa-shield-halved'],
    ['key' => 'admin',      'title' => 'Admin Dashboard',                'desc' => 'CMS, user management & analytics dashboard',                   'cost' => 12, 'icon' => 'fa-solid fa-gauge-high', 'badge' => 'premium'],
    ['key' => 'deploy',     'title' => 'Deployment & CI/CD',             'desc' => 'Vercel/VPS configs, CI/CD pipeline & environment setup',        'cost' => 6,  'icon' => 'fa-solid fa-rocket'],
];
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_TITLE; ?> — <?php echo SITE_TAGLINE; ?></title>
    <meta name="description" content="<?php echo SITE_TAGLINE; ?> — Build production-ready web apps with AI. Next.js, TypeScript, PostgreSQL, auth, admin, and automated deployment.">
    <link rel="icon" href="/favicon.ico">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Outfit', 'sans-serif'] },
                    colors: {
                        darkbg: '#050505',
                        panel: 'rgba(20, 20, 25, 0.7)',
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #050505;
            color: #ffffff;
            background-image:
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 25%);
            background-attachment: fixed;
        }
        .glass-panel {
            background: rgba(20, 20, 25, 0.6);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .stage-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
        }
        .credit-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="flex items-center justify-between px-6 sm:px-8 py-4 relative z-50 border-b border-white/5">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <i class="fa-solid fa-layer-group text-white text-sm"></i>
            </div>
            <a href="" class="text-2xl font-bold tracking-wide">Sam<span class="text-blue-400">FullStack</span></a>
        </div>
        <nav class="flex items-center gap-4 sm:gap-6 text-sm">
            <a href="#stages" class="text-gray-300 hover:text-white transition">Stages</a>
            <a href="/dashboard.php" class="text-gray-300 hover:text-white transition">Dashboard</a>
            <a href="/billing.php" class="text-gray-300 hover:text-white transition">Billing</a>
            <?php if ($session->isLoggedIn()): ?>
                <a href="logout.php" class="text-gray-300 hover:text-white transition">Logout</a>
            <?php else: ?>
                <a href="/login.php" class="text-gray-300 hover:text-white transition">Login</a>
                <a href="/register.php" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition">Sign Up</a>
            <?php endif; ?>
        </nav>
    </header>

    <!-- Hero Section -->
    <main class="flex-1">
        <section class="pt-20 pb-12">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
                    <i class="fa-solid fa-sparkles text-yellow-400"></i>
                    <span class="text-xs font-medium text-gray-300">8-Stage Full-Stack AI Builder</span>
                </div>

                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    Build Production-Ready<br>
                    <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Full-Stack Web Applications
                    </span><br>
                    in Minutes
                </h1>

                <p class="text-lg text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                    From requirements analysis to deployment. Generate Next.js + TypeScript frontends,
                    Node.js backends, PostgreSQL databases, JWT auth, admin dashboards, and CI/CD —
                    all powered by AI. Pay only for the stages you use.
                </p>

                <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <?php if ($session->isLoggedIn()): ?>
                        <a href="/dashboard.php" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition">
                            <i class="fa-solid fa-tachometer-gauge mr-2"></i>Go to Dashboard
                        </a>
                    <?php else: ?>
                        <a href="/register.php" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition">
                            <i class="fa-solid fa-rocket mr-2"></i>Start Building
                        </a>
                        <a href="/login.php" class="border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/5 transition">
                            Sign In
                        </a>
                    <?php endif; ?>
                </div>

                <?php if ($session->isLoggedIn()): ?>
                    <div class="flex items-center justify-center gap-3 text-sm text-gray-400">
                        <span class="flex items-center gap-1"><i class="fa-solid fa-coins text-yellow-400"></i> Balance:</span>
                        <span class="font-bold text-yellow-400"><?php echo formatCredits($credit_balance); ?> credits</span>
                        <span class="text-gray-600">·</span>
                        <a href="/billing.php" class="text-blue-400 hover:text-blue-300">Buy more</a>
                    </div>
                <?php endif; ?>
            </div>
        </section>

        <!-- Stages Overview -->
        <section id="stages" class="py-16 border-t border-white/5">
            <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold mb-3">8-Stage Development Workflow</h2>
                    <p class="text-gray-400 max-w-2xl mx-auto">
                        Each stage generates production-ready code that integrates seamlessly with the next.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <?php foreach ($stages as $stage): ?>
                        <div class="glass-panel rounded-xl p-5 hover:bg-white/5 transition group">
                            <div class="flex items-start gap-4">
                                <div class="stage-icon bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-blue-400 flex-shrink-0">
                                    <i class="<?php echo $stage['icon']; ?>"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-1">
                                        <h3 class="text-lg font-bold group-hover:text-blue-300 transition"><?php echo $stage['title']; ?></h3>
                                        <?php if (isset($stage['badge'])): ?>
                                            <span class="text-[10px] font-bold uppercase text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">Premium</span>
                                        <?php endif; ?>
                    </div>
                                    <p class="text-sm text-gray-400 mb-2 line-clamp-2"><?php echo $stage['desc']; ?></p>
                                    <div class="credit-pill">
                                        <i class="fa-solid fa-coins text-yellow-400 text-xs"></i>
                                        <span class="text-yellow-300"><?php echo $stage['cost']; ?> credits</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="text-center mt-12">
                    <?php if ($session->isLoggedIn()): ?>
                        <a href="/dashboard.php" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition">
                            Launch Full-Stack Builder
                        </a>
                    <?php else: ?>
                        <a href="/register.php" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition">
                            Get Started — Sign Up
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <!-- Tech Stack -->
        <section class="py-16 border-t border-white/5 bg-card/30">
            <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold mb-3">Tech Stack</h2>
                    <p class="text-gray-400">Production-grade frameworks and tools</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div class="glass-panel rounded-xl p-5 text-center">
                        <i class="fa-brands fa-react text-3xl text-blue-400 mb-2"></i>
                        <h4 class="font-bold">Frontend</h4>
                        <p class="text-sm text-gray-400 mt-1">Next.js + TypeScript</p>
                    </div>
                    <div class="glass-panel rounded-xl p-5 text-center">
                        <i class="fa-brands fa-js text-3xl text-yellow-400 mb-2"></i>
                        <h4 class="font-bold">Backend</h4>
                        <p class="text-sm text-gray-400 mt-1">Node.js / Next.js API</p>
                    </div>
                    <div class="glass-panel rounded-xl p-5 text-center">
                        <i class="fa-solid fa-database text-3xl text-green-400 mb-2"></i>
                        <h4 class="font-bold">Database</h4>
                        <p class="text-sm text-gray-400 mt-1">PostgreSQL / MySQL</p>
                    </div>
                    <div class="glass-panel rounded-xl p-5 text-center">
                        <i class="fa-solid fa-layer-group text-3xl text-purple-400 mb-2"></i>
                        <h4 class="font-bold">Deployment</h4>
                        <p class="text-sm text-gray-400 mt-1">Vercel / VPS</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-8 bg-card/30">
        <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
            <div class="flex items-center gap-3 mb-4 sm:mb-0">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <i class="fa-solid fa-layer-group text-white text-xs"></i>
                </div>
                <span class="font-bold">Sam FullStack Builder</span>
            </div>
            <p class="text-sm text-gray-500">
                &copy; <?php echo date('Y'); ?> Powered by SAM AI Ecosystem — <a href="https://samai.com" class="text-gray-400 hover:text-white">samai.com</a>
            </p>
        </div>
    </footer>
</body>
</html>
