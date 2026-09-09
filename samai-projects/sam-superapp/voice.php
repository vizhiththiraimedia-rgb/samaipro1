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
    <title>Voice Typing — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/service.css">
    <style>
        :root { --theme: <?php echo THEME_COLOR; ?>; --theme-hover: <?php echo THEME_COLOR_HOVER; ?>; }
        .voice-container { max-width: 600px; margin: 80px auto; text-align: center; background: #1f2937; padding: 50px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #374151; }
        .mic-button { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, var(--theme), #f43f5e); color: white; font-size: 40px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 30px auto; box-shadow: 0 0 20px rgba(232, 62, 140, 0.4); transition: transform 0.2s; }
        .mic-button:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(232, 62, 140, 0.6); }
        .status { color: #9ca3af; font-size: 16px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container">
        <div class="voice-container">
            <h2>🎙️ AI Voice Typing</h2>
            <p style="color: #9ca3af; margin-top: 10px;">Speak in Sinhala, Tamil, or English, and let AI write it for you.</p>
            
            <button class="mic-button">🎤</button>
            <div class="status">Tap the microphone to start speaking...</div>
            
            <textarea class="form-control" rows="5" placeholder="Your transcribed text will appear here..." style="width: 100%; padding: 15px; border-radius: 8px; background: #111827; border: 1px solid #4b5563; color: white; margin-top: 20px; font-size: 16px;"></textarea>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
