<?php
// =========================================================================
// SAM AI - Sam FullStack Builder - Header Include
// =========================================================================
?>
<header class="flex items-center justify-between px-6 sm:px-8 py-3 relative z-50 bg-[#111827] border-b border-white/5">
    <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <i class="fa-solid fa-layer-group text-white text-xs"></i>
        </div>
        <a href="/" class="text-xl font-bold tracking-wide">Sam<span class="text-blue-400">FullStack</span></a>
    </div>
    <nav class="flex items-center gap-4 text-sm">
        <span class="flex items-center gap-2 text-sm text-gray-300">
            <i class="fa-solid fa-coins text-yellow-400"></i>
            <span class="font-bold text-yellow-300"><?php echo formatCredits($credit_balance ?? 0); ?> credits</span>
        </span>
        <a href="/dashboard.php" class="text-gray-300 hover:text-white transition text-sm font-medium">Dashboard</a>
        <a href="/billing.php" class="text-gray-300 hover:text-white transition text-sm font-medium">Billing</a>
        <?php if (isset($session) && $session->isLoggedIn()): ?>
            <a href="/logout.php" class="text-red-400 hover:text-red-300 transition text-sm font-medium">Logout</a>
        <?php else: ?>
            <a href="/login.php" class="text-gray-300 hover:text-white transition text-sm font-medium">Login</a>
            <a href="/register.php" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg font-medium text-sm hover:shadow-lg transition">Sign Up</a>
        <?php endif; ?>
    </nav>
</header>
