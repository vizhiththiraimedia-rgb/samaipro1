<?php
// =========================================================================
// SAM AI - Master Marketplace (samai.lk)
// Main landing page listing all 35+ services
// =========================================================================

// Load service registry
$registry_path = __DIR__ . '/../api_registry.json';
$registry = file_exists($registry_path) ? json_decode(file_get_contents($registry_path), true) : [];

if (empty($registry)) {
    $registry_path = __DIR__ . '/../../samai-projects/api_registry.json';
    if (file_exists($registry_path)) {
        $registry = json_decode(file_get_contents($registry_path), true);
    }
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
    <title>SAM AI | The Definitive Ecosystem</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Outfit', 'sans-serif'] },
                    colors: {
                        dark: '#0B0E14',
                        card: '#151A22',
                        primary: '#3B82F6',
                        accent: '#00F0FF',
                        samai: '#8b5cf6'
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #0B0E14; color: #FFFFFF; }
        .glass-panel { background: rgba(21, 26, 34, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .hero-gradient { background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.2) 0%, rgba(11, 14, 20, 1) 70%); }
    </style>
</head>
<body class="antialiased">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-panel border-b-0 border-white/5">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-lg">S</div>
                <span class="font-bold text-xl tracking-wide">SAM AI</span>
            </div>
            <div class="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
                <a href="#ecosystem" class="hover:text-white transition">Ecosystem</a>
                <a href="/samai/samaitoken/SAMAI_Whitepaper.html" class="hover:text-white transition">Whitepaper</a>
                <a href="pricing.php" class="hover:text-white transition">Pricing</a>
            </div>
            <div class="flex items-center gap-4">
                <?php if ($is_logged_in): ?>
                    <span class="text-sm text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20">
                        <i class="fa-solid fa-coins mr-1"></i> <?php echo number_format($credit_balance); ?>
                    </span>
                    <a href="account.php" class="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"><i class="fa-regular fa-user mr-2"></i> Account</a>
                <?php else: ?>
                    <a href="auth/login.php" class="text-sm font-bold text-gray-300 hover:text-white transition">Login</a>
                    <a href="auth/register.php" class="text-sm font-bold bg-primary hover:bg-blue-600 px-5 py-2 rounded-lg transition shadow-lg shadow-blue-500/20">Get Started</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
        <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div class="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Web3 + AI Integration Live</span>
            </div>
            
            <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                The Definitive <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-samai">AI Ecosystem</span>
            </h1>
            
            <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Experience 35+ specialized AI micro-services powered by a revolutionary Dual-Treasury Tokenomic model on the Binance Smart Chain.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#services" class="bg-primary hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl transition shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    Explore Services
                </a>
                <a href="/samai/samaitoken/SAMAI_Whitepaper.html" class="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-book"></i> Read Whitepaper
                </a>
            </div>
        </div>
    </header>

    <!-- Live Blockchain Stats -->
    <section class="py-12 border-y border-white/5 bg-card/50">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div class="glass-panel p-6 rounded-2xl">
                    <p class="text-sm text-gray-400 mb-1">SAMAI Token Price</p>
                    <p class="text-3xl font-bold text-white">0.05 <span class="text-sm text-gray-500">LKR</span></p>
                </div>
                <div class="glass-panel p-6 rounded-2xl">
                    <p class="text-sm text-gray-400 mb-1">LUNC Market Price</p>
                    <p class="text-3xl font-bold text-yellow-500 font-mono" id="live-lunc-price">$0.000000</p>
                </div>
                <div class="glass-panel p-6 rounded-2xl">
                    <p class="text-sm text-gray-400 mb-1">Total Supply</p>
                    <p class="text-3xl font-bold text-white">30B <span class="text-sm text-gray-500">SAMAI</span></p>
                </div>
                <div class="glass-panel p-6 rounded-2xl border-samai/30 relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 w-16 h-16 bg-samai/20 rounded-full blur-xl"></div>
                    <p class="text-sm text-gray-400 mb-1">Smart Contract (BSC)</p>
                    <p class="text-lg font-bold text-white font-mono mt-2 truncate text-samai">0xeF1e...1401</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Grid -->
    <section id="services" class="py-24">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4">Ecosystem Services</h2>
                <p class="text-gray-400 max-w-2xl mx-auto">One account. 50+ micro-services. Pay only for what you use using SAMAI Credits.</p>
            </div>

            <!-- Standard Services -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php foreach ($standard_services as $svc): ?>
                <div class="glass-panel rounded-2xl p-6 hover:bg-white/5 transition-colors group cursor-pointer border-t-2" style="border-top-color: <?php echo htmlspecialchars($svc['theme_color']); ?>;">
                    <div class="flex justify-between items-start mb-4">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background: <?php echo htmlspecialchars($svc['theme_color']); ?>20; color: <?php echo htmlspecialchars($svc['theme_color']); ?>;">
                            <i class="fa-solid fa-cube"></i>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded">Standard</span>
                    </div>
                    <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors"><?php echo htmlspecialchars($svc['name']); ?></h3>
                    <p class="text-sm text-gray-400 line-clamp-2"><?php echo htmlspecialchars($svc['description']); ?></p>
                    <div class="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                        <a href="/<?php echo htmlspecialchars($svc['slug']); ?>/?ref=marketplace" class="text-sm font-bold text-primary hover:text-white transition">Launch App &rarr;</a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Premium Services -->
            <?php if (!empty($premium_services)): ?>
            <div class="mt-16">
                <div class="text-center mb-10">
                    <h3 class="text-2xl font-bold mb-2">Premium Services</h3>
                    <p class="text-gray-400">Advanced AI services for complex workflows.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <?php foreach ($premium_services as $svc): ?>
                    <div class="glass-panel rounded-2xl p-6 hover:bg-white/5 transition-colors group cursor-pointer border-t-2" style="border-top-color: <?php echo htmlspecialchars($svc['theme_color']); ?>;">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background: <?php echo htmlspecialchars($svc['theme_color']); ?>20; color: <?php echo htmlspecialchars($svc['theme_color']); ?>;">
                                <i class="fa-solid fa-crown"></i>
                            </div>
                            <span class="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 px-2 py-1 rounded">Premium</span>
                        </div>
                        <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors"><?php echo htmlspecialchars($svc['name']); ?></h3>
                        <p class="text-sm text-gray-400 line-clamp-2"><?php echo htmlspecialchars($svc['description']); ?></p>
                        <div class="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                            <a href="/<?php echo htmlspecialchars($svc['slug']); ?>/?ref=marketplace" class="text-sm font-bold text-primary hover:text-white transition">Launch App &rarr;</a>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-12 bg-card/30">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center gap-2 mb-4 md:mb-0">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-sm">S</div>
                <span class="font-bold text-lg">SAM AI</span>
            </div>
            <p class="text-sm text-gray-500">© 2026 SAM AI Ecosystem. All rights reserved.</p>
            <div class="flex gap-4 mt-4 md:mt-0">
                <a href="#" class="text-gray-500 hover:text-white"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" class="text-gray-500 hover:text-white"><i class="fa-brands fa-discord"></i></a>
                <a href="#" class="text-gray-500 hover:text-white"><i class="fa-brands fa-telegram"></i></a>
            </div>
        </div>
    </footer>

    <!-- Script for Live Blockchain Stats -->
    <script>
        async function fetchLuncPrice() {
            try {
                // Connect to BSC RPC
                const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
                const PANCAKESWAP_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
                const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
                const LUNC_ADDRESS = "0x156ab3346823B651294766e23e6Cf87254d68962";
                
                const ROUTER_ABI = ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"];
                const routerContract = new ethers.Contract(PANCAKESWAP_ROUTER, ROUTER_ABI, provider);
                
                const amountIn = ethers.parseUnits("1000", 18); 
                const amounts = await routerContract.getAmountsOut(amountIn, [LUNC_ADDRESS, USDT_ADDRESS]);
                const priceFor1000 = parseFloat(ethers.formatUnits(amounts[1], 18));
                const price = priceFor1000 / 1000;
                
                document.getElementById('live-lunc-price').innerText = "$" + price.toFixed(6);
            } catch(e) {
                console.error("Could not fetch price via PancakeSwap", e);
                // Fallback to Binance API if PancakeSwap route fails for this wrapped LUNC
                try {
                    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=LUNCUSDT");
                    const data = await res.json();
                    document.getElementById('live-lunc-price').innerText = "$" + parseFloat(data.price).toFixed(6);
                } catch(err) {}
            }
        }
        fetchLuncPrice();
    </script>
</body>
</html>
