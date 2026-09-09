<?php
// =========================================================================
// SAM AI - Footer Include (shared across all pages)
// =========================================================================
?>
<footer class="site-footer" style="background: #0f172a; border-top: 1px solid #1e293b; padding: 60px 0 30px; margin-top: 60px;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px;">
            <!-- Brand Column -->
            <div>
                <h3 style="color: white; font-size: 20px; font-weight: bold; margin-bottom: 15px;">
                    <?php echo SERVICE_NAME; ?>
                </h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                    The Ultimate Super App for Sri Lanka. Experience next-gen AI tools for typing, news, voice, and digital payments all in one place.
                </p>
            </div>
            
            <!-- Quick Links -->
            <div>
                <h4 style="color: white; font-size: 16px; margin-bottom: 15px; font-weight: 600;">Features</h4>
                <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2;">
                    <li><a href="keyboard.php" style="color: #94a3b8; text-decoration: none; font-size: 14px; transition: color 0.3s;">AI Keyboard</a></li>
                    <li><a href="news.php" style="color: #94a3b8; text-decoration: none; font-size: 14px; transition: color 0.3s;">Esana News</a></li>
                    <li><a href="voice.php" style="color: #94a3b8; text-decoration: none; font-size: 14px; transition: color 0.3s;">Voice Typing</a></li>
                    <li><a href="reload.php" style="color: #94a3b8; text-decoration: none; font-size: 14px; transition: color 0.3s;">Reload & Payments</a></li>
                </ul>
            </div>

            <!-- Support -->
            <div>
                <h4 style="color: white; font-size: 16px; margin-bottom: 15px; font-weight: 600;">Support</h4>
                <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2;">
                    <li><a href="dashboard.php" style="color: #94a3b8; text-decoration: none; font-size: 14px;">Dashboard</a></li>
                    <li><a href="billing.php" style="color: #94a3b8; text-decoration: none; font-size: 14px;">Billing</a></li>
                    <li><a href="login.php" style="color: #94a3b8; text-decoration: none; font-size: 14px;">Help Center</a></li>
                    <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 14px;">Privacy Policy</a></li>
                </ul>
            </div>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
                &copy; <?php echo date('Y'); ?> <?php echo SERVICE_NAME; ?>. All rights reserved.
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 0;">
                Powered by <a href="https://samai.com" style="color: var(--theme); text-decoration: none; font-weight: 600;">SAM AI</a>
            </p>
        </div>
    </div>
</footer>
