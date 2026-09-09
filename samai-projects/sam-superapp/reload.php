<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth-check.php';
$user = requireAuth($api, $session);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reload & Payments — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/service.css">
    <style>
        :root { --theme: <?php echo THEME_COLOR; ?>; --theme-hover: <?php echo THEME_COLOR_HOVER; ?>; }
        .reload-container { max-width: 500px; margin: 60px auto; background: #1f2937; padding: 40px; border-radius: 12px; border: 1px solid #374151; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #d1d5db; font-weight: bold; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid #4b5563; border-radius: 8px; background: #111827; color: white; font-size: 16px; }
        .network-logos { display: flex; gap: 10px; margin-bottom: 20px; justify-content: space-between; }
        .network-logos div { background: #374151; padding: 10px; border-radius: 6px; text-align: center; flex: 1; font-weight: bold; color: #d1d5db; border: 2px solid transparent; cursor: pointer; }
        .network-logos div:hover { border-color: var(--theme); }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container">
        <div class="reload-container">
            <h2 style="text-align: center; margin-bottom: 30px;">💳 Digital Reload</h2>
            
            <div class="network-logos">
                <div>Dialog</div>
                <div>Mobitel</div>
                <div>Hutch</div>
                <div>Airtel</div>
            </div>

            <div class="form-group">
                <label>Mobile Number</label>
                <input type="text" placeholder="07X XXX XXXX">
            </div>

            <div class="form-group">
                <label>Reload Amount (LKR)</label>
                <input type="number" placeholder="Enter amount">
            </div>

            <button class="btn-primary" style="width: 100%; padding: 15px; font-size: 18px; margin-top: 10px;">Proceed to Pay</button>
            
            <p style="text-align: center; color: #9ca3af; font-size: 13px; margin-top: 20px;">Secure payments processed via SAM AI Gateway</p>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
