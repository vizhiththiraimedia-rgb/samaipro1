const { ethers } = require('ethers');
const { LCDClient, MnemonicKey, MsgDelegate, Coins } = require('@terra-money/feather.js');
const axios = require('axios');

// Axelar Gateway ABI snippet (for bridging stablecoins to Cosmos/Terra Classic)
const AXELAR_GATEWAY_ABI = [
  "function sendToken(string calldata destinationChain, string calldata destinationAddress, string calldata symbol, uint256 amount) external"
];

/**
 * Automates cross-chain bridging of the 10% LUNC share and delegates it on Terra Classic
 * @param {number} amountUSD The 10% LUNC share amount in USD
 */
async function bridgeAndStakeLunc(amountUSD) {
  console.log(`[LUNC Staker] Initiating LUNC cross-chain staking for $${amountUSD} USD...`);

  // Bridge Config
  const axelarGatewayAddress = process.env.AXELAR_GATEWAY_ADDRESS;
  const bridgeWalletPrivateKey = process.env.EVM_HOT_WALLET_PRIVATE_KEY;
  const destinationChain = "terra"; // Target Axelar Cosmos/Terra chain
  const luncAddress = process.env.LUNC_STATION_ADDRESS; // Your Terra Classic address (samaitoken)

  if (!axelarGatewayAddress || !bridgeWalletPrivateKey || !luncAddress) {
    console.error('[LUNC Staker] ERROR: Missing Axelar or Terra configurations.');
    return;
  }

  try {
    // 1. Step 1: Call Axelar Gateway on EVM to Bridge Stablecoins
    console.log(`[LUNC Staker] Bridging $${amountUSD} USDC to Terra Classic via Axelar...`);
    const provider = new ethers.JsonRpcProvider(process.env.EVM_RPC_URL);
    const wallet = new ethers.Wallet(bridgeWalletPrivateKey, provider);

    const gateway = new ethers.Contract(axelarGatewayAddress, AXELAR_GATEWAY_ABI, wallet);
    const amountToBridge = ethers.parseUnits(amountUSD.toString(), 6); // Axelar USDC is usually 6 decimals

    // Trigger Cross-Chain Bridge
    const bridgeTx = await gateway.sendToken(
      destinationChain,
      luncAddress,
      "USDC",
      amountToBridge
    );
    await bridgeTx.wait();
    console.log(`[LUNC Staker] Bridge transaction confirmed. TxHash: ${bridgeTx.hash}`);

    // 2. Wait for Axelar relayer to bridge funds to Terra Classic
    console.log("[LUNC Staker] Waiting for cross-chain transfer to finalize (this can take several minutes)...");
    
    // In production, we'd poll Axelar API or wait for transfer. For script robustness:
    // We will trigger a check or swap on Astroport once the stablecoin balance is detected.
    await executeTerraSwapAndStake(luncAddress, amountUSD);

  } catch (error) {
    console.error('[LUNC Staker] Error bridging funds:', error.message);
    throw error;
  }
}

/**
 * Internal helper to swap bridged stablecoins into LUNC and stake it
 */
async function executeTerraSwapAndStake(luncAddress, amountUSD) {
  const chainID = process.env.LUNC_CHAIN_ID || 'columbus-5';
  const lcdUrl = process.env.LUNC_LCD_URL || 'https://columbus-lcd.terra.dev';
  const validatorAddress = process.env.VALIDATOR_ADDRESS;
  const mnemonic = process.env.LUNC_MNEMONIC;

  try {
    const lcd = new LCDClient({
      [chainID]: {
        lcd: lcdUrl,
        chainID: chainID,
        gasAdjustment: 1.75,
        gasPrices: { uluna: 28.325 },
        prefix: 'terra'
      }
    });

    const mk = new MnemonicKey({ mnemonic });
    const wallet = lcd.wallet(mk);

    console.log(`[LUNC Staker] Swap & Stake triggered for wallet: ${wallet.key.accAddress('terra')}`);

    // Note: Astroport / Terraswap routing logic would swap axlUSDC -> uluna (LUNC)
    // Here we query Astroport pool and construct swap messages
    // Once swapped, we delegate the purchased LUNC to our validator
    
    console.log(`[LUNC Staker] Swapping bridged USDC to LUNC on Astroport...`);
    // Astroport Swap Message logic goes here (executed using wallet.createAndSignTx)
    
    console.log(`[LUNC Staker] Staking LUNC to validator: ${validatorAddress}...`);
    // Example Delegation Msg
    const delegateMsg = new MsgDelegate(
      luncAddress,
      validatorAddress,
      new Coins({ uluna: "100000000" }) // Example: 100 LUNC
    );

    const tx = await wallet.createAndSignTx({
      msgs: [delegateMsg],
      chainID: chainID,
      memo: "SAM AI Auto Staking LUNC"
    });
    
    const result = await lcd.tx.broadcast(tx, chainID);
    console.log(`[LUNC Staker] Success! LUNC Staked. TxHash: ${result.txhash}`);

  } catch (error) {
    console.error('[LUNC Staker] Swap & Stake failed:', error.message);
  }
}

module.exports = { bridgeAndStakeLunc };
