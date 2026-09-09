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
    <title>Esana News — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/service.css">
    <style>
        :root { --theme: <?php echo THEME_COLOR; ?>; --theme-hover: <?php echo THEME_COLOR_HOVER; ?>; }
        .news-container { max-width: 900px; margin: 40px auto; }
        .news-card { background: #1f2937; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--theme); }
        .news-title { font-size: 20px; font-weight: bold; color: white; margin-bottom: 10px; }
        .news-meta { font-size: 12px; color: #9ca3af; margin-bottom: 15px; }
        .news-content { color: #d1d5db; line-height: 1.6; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container news-container">
        <h2 style="margin-bottom: 30px; text-align: center;">📰 AI Esana Breaking News</h2>
        
        <div class="news-card">
            <div class="news-title">Government Announces New Digital Payment Gateway</div>
            <div class="news-meta">Just now • AI Generated Summary</div>
            <div class="news-content">A new country-wide digital payment infrastructure is set to roll out next month, aiming to connect all local vendors and digital wallets into a single unified grid.</div>
        </div>

        <div class="news-card">
            <div class="news-title">Heavy Rains Expected in Western Province</div>
            <div class="news-meta">2 hours ago • Weather Update</div>
            <div class="news-content">The Meteorological Department warns of heavy showers exceeding 100mm in the Western and Sabaragamuwa provinces over the next 48 hours. Public is advised to take necessary precautions.</div>
        </div>

        <div class="news-card">
            <div class="news-title">Sri Lanka Cricket Team Secures Series Win</div>
            <div class="news-meta">5 hours ago • Sports</div>
            <div class="news-content">The national team won the final T20 match by 4 wickets, securing the series trophy in an exciting last-over finish against the touring side.</div>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
