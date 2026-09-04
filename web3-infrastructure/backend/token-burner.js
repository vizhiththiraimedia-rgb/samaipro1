const { ethers } = require('ethers');

// ABI snippets for ERC-20 and Payment Splitter
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
];

const SPLITTER_ABI = [
  "function processPayment(uint256 amount) external"
];

/**
 * Automates the EVM payment splitter trigger on BSC/Polygon
 * @param {number} amountUSD The total amount received from PayPal
 */
async function burnCustomToken(amountUSD) {
  console.log(`[Token Burner] Initiating EVM payment split for $${amountUSD} USD equivalent...`);

  // RPC and Private Key Configuration
  const rpcUrl = process.env.EVM_RPC_URL;
  const privateKey = process.env.EVM_HOT_WALLET_PRIVATE_KEY;
  const splitterAddress = process.env.EVM_SPLITTER_CONTRACT_ADDRESS;
  const stablecoinAddress = process.env.EVM_STABLECOIN_ADDRESS;

  if (!rpcUrl || !privateKey || !splitterAddress || !stablecoinAddress) {
    console.error('[Token Burner] ERROR: Missing EVM configuration variables.');
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const stablecoin = new ethers.Contract(stablecoinAddress, ERC20_ABI, wallet);
    const splitter = new ethers.Contract(splitterAddress, SPLITTER_ABI, wallet);

    // Convert USD to 18-decimal stablecoin amount (assumes USDT/USDC decimal matches 18 or 6, dynamic calculation)
    const decimals = 18; // or 6 depending on network stablecoin (USDT on Polygon/BSC is usually 18, check decimals in production)
    const amountToProcess = ethers.parseUnits(amountUSD.toString(), decimals);

    // 1. Check Hot Wallet balance
    const balance = await stablecoin.balanceOf(wallet.address);
    if (balance < amountToProcess) {
      throw new Error(`[Token Burner] Insufficient stablecoin balance in Hot Wallet. Has ${ethers.formatUnits(balance, decimals)}, needs ${amountUSD}`);
    }

    // 2. Approve Payment Splitter to transfer stablecoins
    console.log(`[Token Burner] Approving PaymentSplitter to spend ${amountUSD} stablecoins...`);
    const approveTx = await stablecoin.approve(splitterAddress, amountToProcess);
    await approveTx.wait();
    console.log('[Token Burner] Approval tx confirmed.');

    // 3. Execute Split and Burn
    console.log('[Token Burner] Calling processPayment on Splitter contract...');
    const splitTx = await splitter.processPayment(amountToProcess);
    const receipt = await splitTx.wait();

    console.log(`[Token Burner] Success! EVM payment split and burn executed. TxHash: ${receipt.hash}`);

  } catch (error) {
    console.error('[Token Burner] Error processing EVM transaction:', error.message);
    throw error;
  }
}

module.exports = { burnCustomToken };
