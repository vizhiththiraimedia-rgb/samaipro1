<?php
header('Content-Type: application/json');

// Configuration: The URL of our Node.js Automation Engine
$NODE_BOT_URL = 'http://localhost:3006/api/webhook';

// Determine which action was triggered
$action = $_GET['action'] ?? '';

if ($action === 'paypal') {
    // Simulate data coming from PayPal IPN
    $payload = [
        'paymentId' => 'PAYID-' . rand(100000, 999999),
        'fiatAmount' => 500,
        'currency' => 'INR',
        'status' => 'COMPLETED'
    ];
    $endpoint = $NODE_BOT_URL . '/paypal';
    
} elseif ($action === 'voucher') {
    // Simulate data coming from our Voucher Verification DB
    $payload = [
        'voucherCode' => 'TX-500-XYZ89',
        'fiatValue' => 500,
        'userId' => 'USER_' . rand(1000, 9999)
    ];
    $endpoint = $NODE_BOT_URL . '/voucher';
    
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    exit;
}

// Use cURL to send the POST request to the Node.js bot
$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpcode !== 200) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to reach Node.js automation engine. Make sure node automation-engine.js is running on port 3006.']);
} else {
    // Pass the Node.js response back to the frontend
    $nodeResponse = json_decode($response, true);
    echo json_encode([
        'status' => 'success', 
        'data' => $nodeResponse
    ]);
}
?>
