<?php
// =========================================================================
// SAM AI - Master Marketplace Registration
// =========================================================================
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $name = trim($_POST['name'] ?? '');

    if (empty($email) || empty($password) || empty($name)) {
        $error = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters.';
    } else {
        // Register via central API
        $api_base = 'https://samai.com/api';
        $service_key = getenv('SAMAI_MARKETPLACE_KEY') ?: 'svc_samai_lk_master';

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $api_base . '/auth/register',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'email' => $email,
                'password' => $password,
                'name' => $name,
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

        if ($http_code === 200 && $result['status'] === 'success') {
            $_SESSION['samai_user_session'] = [
                'user' => $result['data']['user'] ?? ['email' => $email],
                'token' => $result['data']['access_token'] ?? $result['data']['token'],
                'credits' => 50, // Welcome bonus
            ];
            header('Location: /dashboard.php');
            exit;
        } else {
            $error = $result['detail'] ?? $result['message'] ?? 'Registration failed. Please try again.';
        }
    }
}

$redirect = $_GET['redirect'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up — SAM AI</title>
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
        .divider { text-align: center; margin: 20px 0; color: var(--text-tertiary); font-size: 13px; }
        .login-link { text-align: center; margin-top: 16px; font-size: 14px; }
        .login-link a { color: var(--theme); }
    </style>
</head>
<body>
    <div class="auth-page">
        <div class="auth-card">
            <h1>Create Your SAM AI Account</h1>
            <p class="subtitle">Get 50 free credits to start using any of our 35+ AI services.</p>

            <?php if ($error): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <?php if ($redirect): ?>
                    <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($redirect); ?>">
                <?php endif; ?>
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required placeholder="John Doe">
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="you@example.com">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="At least 6 characters">
                </div>
                <button type="submit" class="btn-submit">Create Account & Get 50 Free Credits</button>
            </form>

            <div class="divider">or</div>

            <div class="login-link">
                Already have an account? <a href="/auth/login<?php echo $redirect ? '?redirect=' . urlencode($redirect) : ''; ?>">Sign In</a>
            </div>
        </div>
    </div>
</body>
</html>
