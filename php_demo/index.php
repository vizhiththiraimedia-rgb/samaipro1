<?php
// =========================================================================
// SAM AI - API Integration Demo for Micro-SaaS
// Place this on your separate cPanel website (e.g. newsflash.com)
// =========================================================================

$api_endpoint = "http://localhost:8000/api/social-news/generate-post"; // Replace with your actual VPS IP/Domain
$api_key = "sk-samai-testkey-12345"; // The key generated from your WHMCS/Billing Panel

// 1. Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['news_url'])) {
    
    $news_url = $_POST['news_url'];
    
    // 2. Prepare cURL request to SAM AI Backend
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    
    // Pass the required fields (url, language)
    $post_fields = [
        'url' => $news_url,
        'language' => 'en'
    ];
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
    
    // 3. SECURE AUTHENTICATION: Pass the API Key in Headers
    $headers = [
        "x-api-key: " . $api_key,
        "Content-Type: application/x-www-form-urlencoded"
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    // 4. Execute Request
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // 5. Handle Response
    if ($http_code === 200) {
        $result = json_decode($response, true);
        $success = true;
    } elseif ($http_code === 402) {
        $error = "Payment Required: Your API Credits are empty! Please recharge your account.";
    } else {
        $error = "API Error ($http_code): " . $response;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>NewsFlash Pro (Micro-SaaS Demo)</title>
    <style>
        body { font-family: Arial, sans-serif; background: #111; color: #fff; padding: 50px; }
        .box { background: #222; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; }
        input[type="text"] { width: 100%; padding: 10px; margin-bottom: 20px; box-sizing: border-box; }
        button { background: #ef4444; color: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; }
        .result { background: #333; padding: 20px; margin-top: 20px; border-radius: 5px; white-space: pre-wrap; }
        .error { color: #ff6b6b; font-weight: bold; }
    </style>
</head>
<body>
    <div class="box">
        <h2>NewsFlash AI Generator</h2>
        <p>Current API Key in use: <code><?php echo substr($api_key, 0, 15) . "..."; ?></code></p>
        
        <?php if (isset($error)) echo "<p class='error'>$error</p>"; ?>
        
        <form method="POST">
            <label>Enter News URL:</label>
            <input type="text" name="news_url" placeholder="https://example.com/news" required>
            <button type="submit">Generate AI Post (Costs 2 Credits)</button>
        </form>

        <?php if (isset($success) && $success): ?>
            <div class="result">
                <h3>Generated Post:</h3>
                <?php echo htmlspecialchars($result['post']); ?>
                
                <?php if (isset($result['image'])): ?>
                    <br><img src="<?php echo $result['image']; ?>" style="max-width:100%; border-radius: 10px; margin-top: 15px;">
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>

