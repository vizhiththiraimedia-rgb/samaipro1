<?php
// =========================================================================
// SAM AI - Master Marketplace Logout
// =========================================================================
session_start();
session_destroy();
header('Location: /auth/login?logged_out=1');
exit;
