<?php
// =========================================================================
// SAM AI - Standalone Service Registration Page
// =========================================================================
require_once __DIR__ . '/config.php';

$error = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm'] ?? '';
    $name = trim($_POST['name'] ?? '');

    // Validation
    if (empty($email) || empty($password) || empty($name)) {
        $error = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters.';
    } elseif ($password !== $confirm) {
        $error = 'Passwords do not match.';
    }

    if (!$error) {
        $result = $api->register($email, $password, $name);

        if ($result['status'] === 'success') {
            $_SESSION['registration_success'] = true;
            $_SESSION['registration_email'] = $email;

            if (isset($result['data']['access_token'])) {
                $session->setUser(
                    $result['data']['user'] ?? ['email' => $email],
                    $result['data']['access_token']
                );
                redirect('/dashboard.php');
            }

            redirect('/login.php?registered=1');
        } else {
            $error = $result['error'] ?? 'Registration failed. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up — <?php echo SITE_TITLE; ?></title>
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
        .login-link { text-align: center; margin-top: 20px; font-size: 14px; }
        .login-link a { color: var(--theme); text-decoration: none; }
        .divider { text-align: center; margin: 20px 0; color: #4b5563; font-size: 13px; }
    </style>
</head>
<body>
    <div class="auth-page">
        <div class="auth-card">
            <h1>Create Your Account</h1>
            <p class="subtitle">Start using <?php echo SERVICE_NAME; ?> today. Powered by SAM AI.</p>

            <?php if ($error): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <?php if (isset($_GET['registered'])): ?>
                <div class="error-msg" style="background: #064e35; color: #6ee7b7;">
                    Account created! Please log in.
                </div>
            <?php endif; ?>

            <form method="POST" action="">
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
                <div class="form-group">
                    <label for="confirm">Confirm Password</label>
                    <input type="password" id="confirm" name="confirm" required placeholder="Retype password">
                </div>
                <button type="submit" class="btn-primary">Create Account</button>
            </form>

            <div class="divider">or</div>

            <div class="login-link">
                Already have an account? <a href="/login.php">Sign In</a>
            </div>
        </div>
    </div>
</body>
</html>
