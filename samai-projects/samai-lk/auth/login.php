<?php
// =========================================================================
// SAM AI - Master Marketplace Login
// =========================================================================
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Please enter both email and password.';
    } else {
        $api_base = 'https://samai.com/api';
        $service_key = getenv('SAMAI_MARKETPLACE_KEY') ?: 'svc_samai_lk_master';

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $api_base . '/auth/login',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'email' => $email,
                'password' => $password,
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'x-api-key: ' . $service_key,
                'Accept: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);

        if ($http_code === 200 && isset($result['data']['access_token'])) {
            $_SESSION['samai_user_session'] = [
                'user' => $result['data']['user'] ?? ['email' => $email],
                'token' => $result['data']['access_token'],
                'credits' => $result['data']['credits'] ?? 0,
            ];

            // Redirect to intended page or dashboard
            $redirect = $_POST['redirect'] ?? $_GET['redirect'] ?? '/dashboard.php';
            header('Location: ' . $redirect);
            exit;
        } else {
            $error = $result['detail'] ?? $result['message'] ?? 'Login failed. Please check your credentials.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — SAM AI</title>
    <link rel="stylesheet" href="/assets/css/marketplace.css">
    <style>
        .auth-page { max-width: 420px; margin: 80px auto; padding: 20px; }
        .auth-card { background: var(--bg-secondary); border-radius: 12px; padding: 40px; border: 1px solid var(--border); }
        .auth-card h1 { color: var(--theme); margin-bottom: 8px; font-size: 28px; }
        .auth-card .subtitle { color: var(--text-tertiary); margin-bottom: 30px; font-size: 15px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 6px; color: var(--text-secondary); font-size: 14px; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px; }
        .form-group input:focus { outline: none; border-color: var(--theme); }
        .btn-submit { width: 100%; padding: 12px; background: var(--theme); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
        .btn-submit:hover { background: var(--theme-hover); }
        .error-msg { background: #7f1d1d; color: #fecaca; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .signup-link { text-align: center; margin-top: 16px; font-size: 14px; }
        .signup-link a { color: var(--theme); }
    </style>
</head>
<body>
    <div class="auth-page">
        <div class="auth-card">
            <h1>Welcome Back to SAM AI</h1>
            <p class="subtitle">Sign in to access all 35+ AI services with your credits.</p>

            <?php if ($error): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($_GET['redirect'] ?? '/dashboard.php'); ?>">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="you@example.com">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Your password">
                </div>
                <button type="submit" class="btn-submit">Sign In</button>
            </form>

            <div class="signup-link">
                Don't have an account? <a href="/auth/register">Create Account — Get 50 Free Credits</a>
            </div>
        </div>
    </div>
</body>
</html>
