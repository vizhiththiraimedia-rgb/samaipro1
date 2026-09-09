<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth-check.php';

$user = requireAuth($api, $session);

// Demo bypass
$credit_balance = 5000;
$has_sufficient_credits = true;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Keyboard — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/service.css">
    <style>
        :root { --theme: <?php echo THEME_COLOR; ?>; --theme-hover: <?php echo THEME_COLOR_HOVER; ?>; }
        .tool-container { max-width: 800px; margin: 40px auto; background: #1f2937; padding: 30px; border-radius: 12px; border: 1px solid #374151; text-align: center; }
        .keyboard-area { width: 100%; height: 200px; padding: 15px; font-size: 18px; border-radius: 8px; border: 1px solid #4b5563; background: #111827; color: white; margin-top: 20px; }
        .lang-switch { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
        .lang-btn { background: #374151; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer; border: none; font-weight: bold; }
        .lang-btn.active { background: var(--theme); }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container">
        <div class="tool-container">
            <h2>⌨️ AI Keyboard</h2>
            <p style="color: #9ca3af; margin-top: 10px;">Smart translation & typing across multiple languages.</p>
            
            <div class="lang-switch">
                <button class="lang-btn active">English</button>
                <button class="lang-btn">Sinhala (සිංහල)</button>
                <button class="lang-btn">Tamil (தமிழ்)</button>
            </div>

            <textarea class="keyboard-area" placeholder="Start typing here... AI will autocorrect and translate in real-time."></textarea>
            
            <button class="btn-primary" style="margin-top: 20px; width: 100%; padding: 15px;">Enable Keyboard System-Wide</button>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
