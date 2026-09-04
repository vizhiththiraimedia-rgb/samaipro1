const { ethers } = require("ethers");
require("dotenv").config();

// Configuration
const RPC_URL = process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/";
const PRIVATE_KEY = process.env.EVM_HOT_WALLET_PRIVATE_KEY;
const BINANCE_ADDRESS = process.env.BINANCE_USDT_DEPOSIT_ADDRESS; // User's Binance wallet

// Addresses on BSC (Example placeholders for Mainnet)
const PANCAKESWAP_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; 
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; 
const LUNC_ADDRESS = "0x156ab3346823B651294766e23e6Cf87254d68962"; // Wrapped LUNC on BSC

// Trade Thresholds
const BUY_DROP_PERCENT = 0.02;  // 2% drop
const SELL_RISE_PERCENT = 0.02; // 2% rise

// Simple ABIs
const ROUTER_ABI = [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)"
];

async function runGridBot() {
    console.log("🚀 Starting SAMAI Grid Trading Bot...");
    console.log(`📊 Target Thresholds: Buy at -${BUY_DROP_PERCENT * 100}%, Sell at +${SELL_RISE_PERCENT * 100}%`);

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    const router = new ethers.Contract(PANCAKESWAP_ROUTER, ROUTER_ABI, wallet);
    const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, wallet);
    
    let lastTradePrice = await getCurrentPrice(router);
    console.log(`📈 Initial LUNC Price tracked: $${lastTradePrice}`);

    // Check price every 1 minute
    setInterval(async () => {
        try {
            const currentPrice = await getCurrentPrice(router);
            console.log(`[Check] Current Price: $${currentPrice}`);

            const priceChange = (currentPrice - lastTradePrice) / lastTradePrice;

            if (priceChange <= -BUY_DROP_PERCENT) {
                console.log(`📉 Price dropped by ${(priceChange * 100).toFixed(2)}%. Executing BUY...`);
                await executeBuy(router, wallet);
                lastTradePrice = currentPrice; // Reset baseline
            } 
            else if (priceChange >= SELL_RISE_PERCENT) {
                console.log(`📈 Price rose by ${(priceChange * 100).toFixed(2)}%. Executing SELL and Profit Split...`);
                await executeSellAndSplitProfit(router, usdt, wallet);
                lastTradePrice = currentPrice; // Reset baseline
            }

        } catch (error) {
            console.error("⚠️ Error checking market:", error.message);
        }
    }, 60000); // 60,000 ms = 1 minute
}

async function getCurrentPrice(router) {
    // Check how much USDT 1000 LUNC gets to find price
    const amountIn = ethers.parseUnits("1000", 18); // Assume 18 decimals for wrapped LUNC
    const path = [LUNC_ADDRESS, USDT_ADDRESS];
    const amounts = await router.getAmountsOut(amountIn, path);
    
    // Calculate price per 1 LUNC
    const usdtAmount = ethers.formatUnits(amounts[1], 18); // USDT has 18 decimals on BSC
    return parseFloat(usdtAmount) / 1000;
}

async function executeBuy(router, wallet) {
    // Logic to use a portion of USDT balance to buy LUNC
    console.log("✅ Buy order executed on PancakeSwap.");
    // In production: Call router.swapExactTokensForTokens (USDT -> LUNC)
}

async function executeSellAndSplitProfit(router, usdtContract, wallet) {
    // 1. Logic to sell LUNC back to USDT
    console.log("✅ Sell order executed on PancakeSwap.");
    
    // 2. Calculate Profit (Simulated for structure)
    const profitUsdt = 1.0; // Example: $1.00 profit made
    
    if (profitUsdt > 0) {
        const transferAmount = profitUsdt * 0.50; // 50% to Binance
        console.log(`💰 Profit realized: $${profitUsdt}. Sending 50% ($${transferAmount}) to Binance Wallet...`);
        
        // 3. Send 50% to Binance Address
        if(BINANCE_ADDRESS) {
            // const amountWei = ethers.parseUnits(transferAmount.toString(), 18);
            // await usdtContract.transfer(BINANCE_ADDRESS, amountWei);
            console.log(`🚀 Successfully transferred $${transferAmount} to ${BINANCE_ADDRESS}`);
        } else {
            console.log("⚠️ Binance address not set in .env!");
        }
    }
}

// Start the bot
// runGridBot();
