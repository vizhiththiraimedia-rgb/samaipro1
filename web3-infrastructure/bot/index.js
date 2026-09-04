require('dotenv').config();
const cron = require('node-cron');
const { 
  LCDClient, 
  MnemonicKey, 
  MsgWithdrawDelegatorReward, 
  MsgDelegate, 
  Coins
} = require('@terra-money/feather.js');

// Configuration Loader
const chainID = process.env.LUNC_CHAIN_ID || 'columbus-5';
const lcdUrl = process.env.LUNC_LCD_URL || 'https://columbus-lcd.terra.dev';
const validatorAddress = process.env.VALIDATOR_ADDRESS;
const mnemonic = process.env.LUNC_MNEMONIC;
const gasReserve = parseInt(process.env.GAS_RESERVE_LUNA || '100000000', 10); // Default: 100 LUNC (100,000,000 uluna)

// Simple logger helper
function log(msg) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
}

async function runAutoCompounding() {
  log("Starting LUNC Staking Auto-Compounding cycle...");

  if (!mnemonic || !validatorAddress) {
    log("ERROR: Missing LUNC_MNEMONIC or VALIDATOR_ADDRESS in environment variables.");
    return;
  }

  try {
    // 1. Initialize LCD Client (Feather.js style)
    const lcd = new LCDClient({
      [chainID]: {
        lcd: lcdUrl,
        chainID: chainID,
        gasAdjustment: 1.75,
        gasPrices: { uluna: 28.325 }, // Gas price estimation for LUNC network
        prefix: 'terra'
      }
    });

    // 2. Initialize Wallet
    const mk = new MnemonicKey({ mnemonic });
    const wallet = lcd.wallet(mk);
    const delegatorAddress = wallet.key.accAddress('terra');
    log(`Initialized wallet address: ${delegatorAddress}`);

    // 3. Step 1: Claim Accrued Staking Rewards
    log(`Claiming rewards from validator: ${validatorAddress}...`);
    const claimMsg = new MsgWithdrawDelegatorReward(delegatorAddress, validatorAddress);

    const txOpts = {
      msgs: [claimMsg],
      chainID: chainID,
      memo: "SAM AI Auto-Compound Reward Claim"
    };

    // Estimate gas and sign
    const claimTx = await wallet.createAndSignTx(txOpts);
    const claimResult = await lcd.tx.broadcast(claimTx, chainID);

    if (claimResult.code !== undefined && claimResult.code !== 0) {
      throw new Error(`Claim transaction failed with code ${claimResult.code}: ${claimResult.raw_log}`);
    }
    log(`Success! Reward claim TxHash: ${claimResult.txhash}`);

    // Wait a brief moment for blockchain state to update
    await new Promise(resolve => setTimeout(resolve, 6000));

    // 4. Step 2: Fetch Current Balance
    log("Fetching current wallet balance...");
    const [balances] = await lcd.bank.balance(delegatorAddress);
    const ulunaBalance = balances.get('uluna');
    const balanceAmount = ulunaBalance ? parseInt(ulunaBalance.amount.toString(), 10) : 0;
    
    log(`Current wallet balance: ${balanceAmount / 1_000_000} LUNC (${balanceAmount} uluna)`);

    // 5. Step 3: Calculate Staking Amount with Safety Gas Reserve
    const amountToDelegate = balanceAmount - gasReserve;

    if (amountToDelegate <= 0) {
      log(`Staking amount (${amountToDelegate / 1_000_000} LUNC) is below or equal to zero after reserving ${gasReserve / 1_000_000} LUNC for gas. Skipping compounding for today.`);
      return;
    }

    log(`Allocating ${amountToDelegate / 1_000_000} LUNC for restaking (keeping ${gasReserve / 1_000_000} LUNC as gas safety guard)...`);

    // 6. Step 4: Restake / Delegate
    const delegateMsg = new MsgDelegate(
      delegatorAddress, 
      validatorAddress, 
      new Coins({ uluna: amountToDelegate })
    );

    const delegateTx = await wallet.createAndSignTx({
      msgs: [delegateMsg],
      chainID: chainID,
      memo: "SAM AI Auto-Compound Staking"
    });

    const delegateResult = await lcd.tx.broadcast(delegateTx, chainID);

    if (delegateResult.code !== undefined && delegateResult.code !== 0) {
      throw new Error(`Delegation transaction failed with code ${delegateResult.code}: ${delegateResult.raw_log}`);
    }

    log(`Success! Restaked LUNC. Delegation TxHash: ${delegateResult.txhash}`);
    log("Auto-compounding cycle completed successfully!");

  } catch (error) {
    log(`CRITICAL ERROR in compounding loop: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

// CRON JOB SETUP: Run every 24 hours at midnight
cron.schedule('0 0 * * *', () => {
  runAutoCompounding();
});

// Run once immediately on startup to verify setup
runAutoCompounding();
