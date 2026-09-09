<?php
// =========================================================================
// SAM AI - Standalone Service Login Page
// =========================================================================
require_once __DIR__ . '/config.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Please enter both email and password.';
    } else {
        $result = $api->login($email, $password);

        if ($result['status'] === 'success') {
            $session->setUser(
                $result['user'] ?? ['email' => $email],
                $result['token']
            );
            redirect('/dashboard.php');
        } else {
            $error = $result['error'] ?? 'Login failed. Please check your credentials.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — <?php echo SITE_TITLE; ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        .auth-page { max-width: 420px; margin: 80px auto; padding: 20px; }
        .auth-card { background: #1f2937; border-radius: 12px; padding: 40px; border: 1px solid #374151; }
        .auth-card h1 { color: var(--theme); margin-bottom: 10px; font-size: 28px; }
        .auth-card .subtitle { color: #9ca3af; margin-bottom: 30px; font-size: 14px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 6px; color: #d1d5db; font-size: 14px; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid #4b5563; border-radius: 8px; background: #111827; color: #fff; font-size: 14px; }
        .form-group input:focus { outline: none; border-color: var(--theme); }
        .btn-primary { width: 100%; padding: 12px; background: var(--theme); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
        .btn-primary:hover { background: var(--theme-hover); }
        .error-msg { background: #7f1d1d; color: #fecaca; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .signup-link { text-align: center; margin-top: 20px; font-size: 14px; }
        .signup-link a { color: var(--theme); text-decoration: none; }
    </style>
</head>
<body>
    <div class="auth-page">
        <div class="auth-card">
            <h1>Welcome Back</h1>
            <p class="subtitle">Sign in to your <?php echo SERVICE_NAME; ?> account</p>

            <?php if ($error): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <?php if (isset($_GET['registered'])): ?>
                <div class="error-msg" style="background: #064e35; color: #6ee7b7;">
                    Account created successfully! Please log in.
                </div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="you@example.com">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Your password">
                </div>
                <button type="submit" class="btn-primary">Sign In</button>
            </form>

            <div class="signup-link">
                Don't have an account? <a href="/register.php">Sign Up</a>
            </div>
        </div>
    </div>
</body>
</html>
