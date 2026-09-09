// SAMAI Pay - Universal Web3 Gateway Logic
// Uses Ethers.js v6

const TREASURY_WALLET = "0x025B2C26a1635b56bc0C49A81E443a6D31D22A22"; // User's Admin Wallet

const TOKENS = {
    SAMAI: { address: "0xeF1e05c294C9c9649bAd3De97AD7bf480e081401", decimals: 18, isNative: false }, // Pegged 1:1 with LUNC
    USDT: { address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18, isNative: false },
    LUNC: { address: "0x156ab3346823B651294766e23e6Cf87254d68962", decimals: 18, isNative: false },
    BNB: { address: "native", decimals: 18, isNative: true }
};

const PANCAKESWAP_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

const ERC20_ABI = [
    "function transfer(address to, uint amount) returns (bool)",
    "function decimals() view returns (uint8)"
];
const ROUTER_ABI = [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"
];

let provider;
let signer;
let userAddress;
let currentToken = "SAMAI";
let fiatAmount = 0.00;
let calculatedCryptoAmount = 0;
let isProcessing = false;

// Initialize
async function init() {
    // Parse URL params for Merchant integrations (e.g. ?amount=5.00&orderId=TX1234)
    const urlParams = new URLSearchParams(window.location.search);
    fiatAmount = parseFloat(urlParams.get('amount')) || 10.00; // Default $10
    const orderId = urlParams.get('orderId') || 'SAMAI-' + Math.floor(Math.random()*10000);
    
    document.getElementById('fiat-amount').innerText = `$${fiatAmount.toFixed(2)}`;
    document.getElementById('order-id').innerText = `Order ID: ${orderId}`;

    // Token Selection Listeners
    document.querySelectorAll('.token-option').forEach(el => {
        el.addEventListener('click', (e) => {
            document.querySelectorAll('.token-option').forEach(opt => opt.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            currentToken = e.currentTarget.getAttribute('data-token');
            updatePrice();
        });
    });

    document.getElementById('pay-btn').addEventListener('click', handlePayment);

    // Initial price check using public RPC
    updatePrice();
}

async function updatePrice() {
    const cryptoAmountEl = document.getElementById('crypto-amount');
    const exchangeRateEl = document.getElementById('exchange-rate');
    
    cryptoAmountEl.innerText = "Calculating...";
    
    try {
        const publicProvider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
        const router = new ethers.Contract(PANCAKESWAP_ROUTER, ROUTER_ABI, publicProvider);

        if (currentToken === "USDT") {
            // USDT is $1
            calculatedCryptoAmount = fiatAmount;
            cryptoAmountEl.innerText = `${calculatedCryptoAmount.toFixed(2)} USDT`;
            exchangeRateEl.innerText = `1 USDT = $1.00`;
        }
        else {
            // Fetch Live Price from PancakeSwap
            // For SAMAI, we use LUNC's address since they are pegged 1:1
            const fetchAddress = currentToken === "SAMAI" ? TOKENS.LUNC.address : TOKENS[currentToken].address;
            
            const path = currentToken === "BNB" 
                ? [WBNB_ADDRESS, TOKENS.USDT.address] 
                : [fetchAddress, TOKENS.USDT.address];
            
            const oneToken = ethers.parseUnits("1", 18);
            const amounts = await router.getAmountsOut(oneToken, path);
            const priceInUsdt = parseFloat(ethers.formatUnits(amounts[1], 18));
            
            calculatedCryptoAmount = fiatAmount / priceInUsdt;
            
            cryptoAmountEl.innerText = `${calculatedCryptoAmount.toFixed(currentToken === "BNB" ? 6 : 0)} ${currentToken}`;
            
            if (currentToken === "SAMAI") {
                exchangeRateEl.innerText = `1 SAMAI = 1 LUNC (~$${priceInUsdt.toFixed(6)})`;
            } else {
                exchangeRateEl.innerText = `1 ${currentToken} = $${priceInUsdt.toFixed(currentToken === "BNB" ? 2 : 6)}`;
            }
        }
    } catch (error) {
        console.error("Price fetch error:", error);
        cryptoAmountEl.innerText = "Network Error";
    }
}

async function handlePayment() {
    if (isProcessing) return;

    if (!window.ethereum) {
        alert("Please install MetaMask or TrustWallet to pay.");
        return;
    }

    try {
        setLoading(true);

        if (!signer) {
            provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            signer = await provider.getSigner();
            userAddress = accounts[0];
            
            document.getElementById('wallet-address').innerText = userAddress.substring(0, 6) + "..." + userAddress.substring(38);
            document.getElementById('status-dot').classList.replace('bg-red-500', 'bg-green-500');
            document.getElementById('pay-text').innerText = `Pay ${calculatedCryptoAmount.toFixed(4)} ${currentToken}`;
            setLoading(false);
            return; // Wait for second click to actually pay
        }

        // Execute Payment
        const amountWei = ethers.parseUnits(calculatedCryptoAmount.toString(), TOKENS[currentToken].decimals);
        let tx;

        if (TOKENS[currentToken].isNative) {
            // Send BNB
            tx = await signer.sendTransaction({
                to: TREASURY_WALLET,
                value: amountWei
            });
        } else {
            // Send ERC20
            const contract = new ethers.Contract(TOKENS[currentToken].address, ERC20_ABI, signer);
            tx = await contract.transfer(TREASURY_WALLET, amountWei);
        }

        document.getElementById('pay-text').innerText = "Confirming Tx...";
        await tx.wait(); // Wait for blockchain confirmation
        
        // Show Success Modal
        document.getElementById('tx-link').href = `https://bscscan.com/tx/${tx.hash}`;
        document.getElementById('success-modal').classList.remove('hidden');
        
    } catch (error) {
        console.error("Payment failed:", error);
        alert("Payment failed or rejected: " + (error.reason || error.message));
        document.getElementById('pay-text').innerText = `Pay ${calculatedCryptoAmount.toFixed(4)} ${currentToken}`;
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    isProcessing = isLoading;
    document.getElementById('pay-loader').style.display = isLoading ? 'block' : 'none';
    if(isLoading) document.getElementById('pay-text').innerText = "Processing...";
}

// Start
init();
