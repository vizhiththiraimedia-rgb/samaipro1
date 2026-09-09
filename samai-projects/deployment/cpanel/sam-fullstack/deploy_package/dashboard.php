<?php
// =========================================================================
// SAM AI - Sam FullStack Builder - Multi-Stage Dashboard
// Renders a tab-based interface for all 8 development stages.
// =========================================================================
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth-check.php';

$user = requireAuth($api, $session);
$api->setToken($session->getToken());

// Get credit balance
$balance_result = $api->getCreditBalance();
$credit_balance = $balance_result['status'] === 'success'
    ? ($balance_result['data']['balance'] ?? 0)
    : 0;

// Define the development stages in order
$stages = [
    'plan'      => ['title' => 'Requirements & Planning',  'desc' => 'Analyze requirements, plan features & architecture',           'cost' => 3,  'icon' => 'fa-solid fa-magnifying-glass-chart'],
    'scaffold'  => ['title' => 'Project Scaffold',          'desc' => 'Generate complete project structure & codebase',               'cost' => 25, 'icon' => 'fa-solid fa-cube'],
    'frontend'  => ['title' => 'Frontend Development',      'desc' => 'Next.js + TypeScript + Tailwind responsive UI',                'cost' => 10, 'icon' => 'fa-brands fa-js'],
    'backend'   => ['title' => 'Backend & API',              'desc' => 'Node.js/Next.js API routes & server logic',                     'cost' => 10, 'icon' => 'fa-solid fa-server'],
    'database'  => ['title' => 'Database Design',           'desc' => 'PostgreSQL/MySQL schema, models & migrations',                'cost' => 8,  'icon' => 'fa-solid fa-database'],
    'auth'      => ['title' => 'Authentication & Security',  'desc' => 'JWT/OAuth, RBAC, sessions & API security',                       'cost' => 8,  'icon' => 'fa-solid fa-shield-halved'],
    'admin'     => ['title' => 'Admin Dashboard',            'desc' => 'CMS, user management & analytics dashboard',                   'cost' => 12, 'icon' => 'fa-solid fa-gauge-high'],
    'deploy'    => ['title' => 'Deployment & CI/CD',         'desc' => 'Vercel/VPS configs, CI/CD pipeline & environment setup',        'cost' => 6,  'icon' => 'fa-solid fa-rocket'],
];

// Determine active stage from query param
$active_stage = $_GET['stage'] ?? 'scaffold';
if (!isset($stages[$active_stage]) || !isset($SAMAI_ENDPOINTS[$active_stage])) {
    $active_stage = 'scaffold';
}

$ep = $SAMAI_ENDPOINTS[$active_stage] ?? null;
$stage_info = $stages[$active_stage] ?? null;
$stage_cost = $ep['cost'] ?? 0;
$has_sufficient_credits = $credit_balance >= $stage_cost;

$result = null;
$error = '';
$generated_code = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['generate'])) {
    $selected_stage = $_POST['stage'] ?? 'scaffold';

    if (isset($SAMAI_ENDPOINTS[$selected_stage])) {
        $ep = $SAMAI_ENDPOINTS[$selected_stage];
        $stage_cost = $ep['cost'];
        $has_sufficient_credits = $credit_balance >= $stage_cost;

        if (!$has_sufficient_credits) {
            ob_start();
            showPaymentRequired($credit_balance, $stage_cost, $api);
            exit;
        }

        // Build params from form data
        $params = [];
        foreach ($_POST as $key => $value) {
            if ($key !== 'generate' && $key !== 'stage') {
                $params[$key] = is_array($value) ? $value : trim($value);
            }
        }

        $endpoint = $ep['path'];
        $api_result = $api->post($endpoint, $params);

        if ($api_result['status'] === 'success') {
            $result = $api_result['data'];
        } elseif ($api_result['status'] === 'payment_required') {
            ob_start();
            showPaymentRequired($api_result['current_balance'] ?? 0, $api_result['cost_required'], $api);
            exit;
        } else {
            $error = $api_result['error'] ?? 'API request failed.';
            $result = $api_result['data'] ?? null;
        }

        // Refresh credit balance
        $balance_result = $api->getCreditBalance();
        if ($balance_result['status'] === 'success') {
            $credit_balance = $balance_result['data']['balance'] ?? 0;
            $has_sufficient_credits = $credit_balance >= $stage_cost;
        }
    }
}

// Extract result content for display
if ($result) {
    if (isset($result['code'])) {
        $generated_code = $result['code'];
    } elseif (isset($result['files'])) {
        $generated_code = json_encode($result['files'], JSON_PRETTY_PRINT);
    } elseif (isset($result['project'])) {
        $generated_code = json_encode($result['project'], JSON_PRETTY_PRINT);
    } elseif (isset($result['result'])) {
        $generated_code = $result['result'];
    } elseif (isset($result['content'])) {
        $generated_code = $result['content'];
    } elseif (isset($result['response'])) {
        $generated_code = $result['response'];
    } else {
        $generated_code = json_encode($result, JSON_PRETTY_PRINT);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="/assets/css/service.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js"></script>
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
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 25%);
        }
        .glass-panel {
            background: rgba(20, 20, 25, 0.6);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .stage-tab {
            transition: all 0.2s ease;
        }
        .stage-tab.active {
            background: rgba(59, 130, 246, 0.15);
            border-color: rgba(59, 130, 246, 0.5);
        }
        .code-output {
            background: #0d1117;
            border-radius: 10px;
            max-height: 500px;
            overflow: auto;
        }
        .form-group textarea,
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px 14px;
            border-radius: 8px;
            background: #111827;
            border: 1px solid #374151;
            color: #f3f4f6;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        .form-group textarea:focus,
        .form-group input:focus,
        .form-group select:focus {
            border-color: #3b82f6;
        }
        .form-group textarea { min-height: 120px; resize: vertical; font-family: 'Fira Code', monospace; }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #d1d5db;
            font-size: 13px;
            font-weight: 500;
        }
        .form-group .required::after { content: " *"; color: #ef4444; }
        .nav-tab {
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            white-space: nowrap;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col">
    <?php include 'includes/header.php'; ?>

    <div class="flex max-w-7xl mx-auto w-full">
        <!-- Stage Sidebar -->
        <aside class="w-64 border-r border-white/5 p-4 overflow-y-auto" style="max-height: calc(100vh - 73px);">
            <div class="mb-6">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-xs font-bold uppercase text-gray-500">Development Stages</h3>
                    <span class="text-xs text-gray-400"><?php echo formatCredits($credit_balance); ?> credits</span>
                </div>
                <div class="space-y-1">
                    <?php foreach ($stages as $stage_key => $stage): ?>
                        <a href="?stage=<?php echo $stage_key; ?>"
                           class="nav-tab flex items-center gap-3 <?php echo ($stage_key === $active_stage) ? 'active text-blue-300' : 'text-gray-400 hover:text-gray-300'; ?>">
                            <i class="<?php echo $stage['icon']; ?> text-lg"></i>
                            <span><?php echo $stage['title']; ?></span>
                            <span class="credit-pill ml-auto"><?php echo $stage['cost']; ?></span>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="border-t border-white/5 pt-4">
                <a href="/billing.php" class="flex items-center gap-3 nav-tab text-gray-400 hover:text-gray-300 mb-2">
                    <i class="fa-solid fa-credit-card text-lg"></i>
                    <span>Buy Credits</span>
                </a>
                <a href="/logout.php" class="flex items-center gap-3 nav-tab text-gray-400 hover:text-red-400">
                    <i class="fa-solid fa-right-from-bracket text-lg"></i>
                    <span>Logout</span>
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-6 overflow-y-auto">
            <!-- Stage Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center text-blue-400">
                        <i class="<?php echo $stage_info['icon']; ?>"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold"><?php echo $stage_info['title']; ?></h1>
                        <p class="text-sm text-gray-400"><?php echo $stage_info['desc'] ?? ''; ?></p>
                    </div>
                </div>
                <div class="credit-pill">
                    <i class="fa-solid fa-coins text-yellow-400"></i>
                    Cost: <?php echo $stage_cost; ?> credits
                </div>
            </div>

            <!-- Error -->
            <?php if ($error): ?>
                <div class="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-4">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <!-- Form Section -->
            <div class="glass-panel rounded-xl p-6 mb-6">
                <form method="POST" action="">
                    <input type="hidden" name="stage" value="<?php echo $active_stage; ?>">

                    <?php if ($ep && isset($ep['params'])): ?>
                        <?php foreach ($ep['params'] as $field_name => $field_def): ?>
                            <div class="form-group">
                                <label for="<?php echo $field_name; ?>" class="<?php echo ($field_def['required'] ?? false) ? 'required' : ''; ?>">
                                    <?php echo $field_def['label'] ?? ucwords(str_replace('_', ' ', $field_name)); ?>
                                </label>
                                <?php echo getEndpointField($field_name, $field_def); ?>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="form-group">
                            <label for="prompt" class="required">Prompt</label>
                            <textarea name="prompt" id="prompt" required placeholder="Describe what you want to build..."></textarea>
                        </div>
                    <?php endif; ?>

                    <div class="form-group mt-4">
                        <label>Current Balance</label>
                        <input type="text" readonly value="<?php echo formatCredits($credit_balance); ?> credits available">
                    </div>

                    <button type="submit" name="generate"
                            class="w-full py-3 px-6 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2
                                   <?php echo $has_sufficient_credits
                                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                                       : 'bg-gray-700 text-gray-400 cursor-not-allowed'; ?>"
                            <?php echo !$has_sufficient_credits ? 'disabled' : ''; ?>>
                        <?php if (!$has_sufficient_credits): ?>
                            <i class="fa-solid fa-exclamation-triangle"></i> Insufficient Credits
                        <?php else: ?>
                            <i class="fa-solid fa-rocket"></i> Generate — <?php echo $stage_cost; ?> credits
                        <?php endif; ?>
                    </button>
                </form>
            </div>

            <!-- Result Section -->
            <?php if ($result): ?>
                <div class="glass-panel rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold">Generated Output</h2>
                        <div class="flex gap-2">
                            <button onclick="downloadOutput()" class="px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                                <i class="fa-solid fa-download mr-1"></i> Download
                            </button>
                            <button onclick="copyOutput()" class="px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                                <i class="fa-solid fa-copy mr-1"></i> Copy
                            </button>
                        </div>
                    </div>

                    <?php if (!empty($result['files']) || !empty($result['project'])): ?>
                        <div class="mb-4">
                            <h3 class="font-bold text-gray-300 mb-2">Project Files</h3>
                            <?php
                            $file_list = $result['files'] ?? ($result['project']['files'] ?? []);
                            if (is_array($file_list)):
                                foreach ($file_list as $filepath => $content):
                            ?>
                                <div class="mb-3">
                                    <div class="text-sm font-mono text-blue-400 bg-gray-900/50 px-3 py-1 rounded-t">
                                        <?php echo htmlspecialchars($filepath); ?>
                                    </div>
                                    <?php if (is_string($content)): ?>
                                        <pre class="code-output"><code class="language-<?php echo pathinfo(strtolower($filepath), PATHINFO_EXTENSION); ?>"><?php echo htmlspecialchars($content); ?></code></pre>
                                    <?php endif; ?>
                                </div>
                            <?php
                                endforeach;
                            else:
                                echo '<p class="text-gray-400">No files generated.</p>';
                            endif;
                            ?>
                        </div>
                    <?php endif; ?>

                    <div id="output-container">
                        <pre class="code-output"><code id="generated-output" class="language-plaintext"><?php echo htmlspecialchars($generated_code); ?></code></pre>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Navigation -->
            <?php
            $stage_keys = array_keys($stages);
            $current_index = array_search($active_stage, $stage_keys);
            $has_prev = $current_index > 0;
            $has_next = $current_index < count($stage_keys) - 1;
            ?>
            <div class="flex justify-between mt-6">
                <?php if ($has_prev): ?>
                    <a href="?stage=<?php echo $stage_keys[$current_index - 1]; ?>"
                       class="px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                        <i class="fa-solid fa-chevron-left mr-1"></i> Previous Stage
                    </a>
                <?php endif; ?>
                <?php if ($has_next): ?>
                    <a href="?stage=<?php echo $stage_keys[$current_index + 1]; ?>"
                       class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-medium hover:shadow-lg transition ml-auto">
                        Next Stage <i class="fa-solid fa-chevron-right ml-1"></i>
                    </a>
                <?php endif; ?>
            </div>
        </main>
    </div>

    <script>
        Prism.highlightAll();

        function downloadOutput() {
            const content = document.getElementById('generated-output').textContent;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'samai-<?php echo $active_stage; ?>-output.txt';
            a.click();
            URL.revokeObjectURL(url);
        }

        function copyOutput() {
            const content = document.getElementById('generated-output').textContent;
            navigator.clipboard.writeText(content).then(() => {
                alert('Copied to clipboard!');
            });
        }
    </script>
</body>
</html>
