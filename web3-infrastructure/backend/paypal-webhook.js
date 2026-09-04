require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { burnCustomToken } = require('./token-burner');
const { bridgeAndStakeLunc } = require('./lunc-staker');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const PAYPAL_VERIFY_URL = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com/v1/notifications/verify-webhook-signature'
  : 'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature';

/**
 * Helper to verify PayPal webhook signature to prevent spoofing
 */
async function verifyPayPalSignature(req) {
  try {
    const response = await axios.post(PAYPAL_VERIFY_URL, {
      auth_algo: req.headers['paypal-auth-algo'],
      cert_url: req.headers['paypal-cert-url'],
      transmission_id: req.headers['paypal-transmission-id'],
      transmission_sig: req.headers['paypal-transmission-sig'],
      transmission_time: req.headers['paypal-transmission-time'],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: req.body
    });
    return response.data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying PayPal signature:', error.message);
    return false;
  }
}

/**
 * POST /api/v1/payments/paypal-webhook
 * Handles incoming PayPal payment completions
 */
app.post('/api/v1/payments/paypal-webhook', async (req, res) => {
  const event = req.body;

  // 1. Verify Webhook Authenticity
  const isVerified = await verifyPayPalSignature(req);
  if (!isVerified) {
    console.warn('WARNING: Received unverified PayPal Webhook event.');
    return res.status(400).send('Webhook signature verification failed');
  }

  // 2. Filter for Completed Transactions
  if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
    const sale = event.resource;
    const amountUSD = parseFloat(sale.amount.total);
    console.log(`Payment sale completed: $${amountUSD} USD from ${sale.payer_email || 'unknown payer'}`);

    // Fee Split Calculations (80/10/10)
    const treasuryShare = amountUSD * 0.80; // Kept in fiat / PayPal Account
    const burnShareUSD = amountUSD * 0.10;  // 10% allocated for token burn
    const luncShareUSD = amountUSD * 0.10;  // 10% allocated for LUNC Staking

    console.log(`Splitting funds: Treasury = $${treasuryShare}, Burn Allocation = $${burnShareUSD}, LUNC Allocation = $${luncShareUSD}`);

    // Execute Web3 Automations asynchronously (don't block PayPal webhook response)
    
    // A. Trigger Custom Token Buy & Burn
    burnCustomToken(burnShareUSD).catch(err => {
      console.error('Error during token burn automation:', err.message);
    });

    // B. Trigger Staking & Bridging to Terra Classic (LUNC)
    bridgeAndStakeLunc(luncShareUSD).catch(err => {
      console.error('Error during LUNC bridging & staking automation:', err.message);
    });
  }

  // Acknowledge receipt of webhook
  res.status(200).send('Webhook processed');
});

app.listen(PORT, () => {
  console.log(`PayPal webhook backend listening on port ${PORT}`);
});
