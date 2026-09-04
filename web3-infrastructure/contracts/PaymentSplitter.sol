// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function WETH() external pure returns (address);
}

interface ISAMAIUtilityToken is IERC20 {
    function burn(uint256 amount) external;
}

/**
 * @title PaymentSplitter
 * @dev Splitting contract that receives stablecoins (USDT/USDC), distributes 80% to Treasury,
 * 10% to the LUNC Bridge wallet, and swaps 10% for SAMAI to auto-burn it on PancakeSwap/Uniswap.
 */
contract PaymentSplitter is Ownable {
    using SafeERC20 for IERC20;

    // Split distribution ratios (expressed in basis points: 10000 = 100%)
    uint256 public constant TREASURY_BPS = 8000; // 80%
    uint256 public constant BURN_BPS = 1000;     // 10%
    uint256 public constant LUNC_BPS = 1000;     // 10%
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Key Addresses
    address public treasuryWallet;
    address public bridgeWallet; // Holds funds to be bridged to Terra Classic (columbus-5)
    
    ISAMAIUtilityToken public samaiToken;
    IERC20 public stablecoin; // e.g. USDT or USDC
    IUniswapV2Router02 public dexRouter;

    event PaymentReceived(address indexed user, uint256 amount);
    event SplitCompleted(uint256 treasuryShare, uint256 luncShare, uint256 burnShare);
    event BurnExecuted(uint256 amountSwapped, uint256 amountBurned);

    constructor(
        address _stablecoin,
        address _samaiToken,
        address _dexRouter,
        address _treasuryWallet,
        address _bridgeWallet
    ) Ownable(msg.sender) {
        require(_stablecoin != address(0), "Invalid stablecoin");
        require(_samaiToken != address(0), "Invalid SAMAI Token");
        require(_dexRouter != address(0), "Invalid DEX Router");
        require(_treasuryWallet != address(0), "Invalid Treasury");
        require(_bridgeWallet != address(0), "Invalid Bridge Wallet");

        stablecoin = IERC20(_stablecoin);
        samaiToken = ISAMAIUtilityToken(_samaiToken);
        dexRouter = IUniswapV2Router02(_dexRouter);
        treasuryWallet = _treasuryWallet;
        bridgeWallet = _bridgeWallet;
    }

    /**
     * @dev Process service payment and trigger the automated 80/10/10 split
     */
    function processPayment(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        // Transfer stablecoins from user/payment script to this contract
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        emit PaymentReceived(msg.sender, amount);

        // Split calculations
        uint256 treasuryShare = (amount * TREASURY_BPS) / BPS_DENOMINATOR;
        uint256 luncShare = (amount * LUNC_BPS) / BPS_DENOMINATOR;
        uint256 burnShare = amount - treasuryShare - luncShare; // remaining ~10%

        // Route 80% to Treasury
        stablecoin.safeTransfer(treasuryWallet, treasuryShare);

        // Route 10% to LUNC Bridge Wallet
        stablecoin.safeTransfer(bridgeWallet, luncShare);

        // Swap and burn remaining 10%
        _swapAndBurn(burnShare);

        emit SplitCompleted(treasuryShare, luncShare, burnShare);
    }

    /**
     * @dev Internal helper to swap stablecoin for SAMAI utility token on DEX and burn it.
     */
    function _swapAndBurn(uint256 stablecoinAmount) internal {
        // Approve router to spend stablecoins
        stablecoin.safeApprove(address(dexRouter), stablecoinAmount);

        // Path: Stablecoin -> WETH (or native gas token) -> SAMAI
        address[] memory path = new address[](3);
        path[0] = address(stablecoin);
        path[1] = dexRouter.WETH();
        path[2] = address(samaiToken);

        uint256 balanceBefore = samaiToken.balanceOf(address(this));

        // Swap stablecoin for SAMAI
        try dexRouter.swapExactTokensForTokens(
            stablecoinAmount,
            0, // Accept any amount of SAMAI (slippage tolerance should be updated in production)
            path,
            address(this),
            block.timestamp + 300
        ) {
            uint256 balanceAfter = samaiToken.balanceOf(address(this));
            uint256 samaiReceived = balanceAfter - balanceBefore;

            if (samaiReceived > 0) {
                // Burn the swapped custom utility tokens
                samaiToken.burn(samaiReceived);
                emit BurnExecuted(stablecoinAmount, samaiReceived);
            }
        } catch {
            // Fallback: If swap fails (e.g. liquidity pool not ready), hold tokens in contract for manual burn
            emit BurnExecuted(0, 0);
        }
    }

    // Administrative Updates (Should be governed by a Time-lock contract)
    function updateTreasuryWallet(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        treasuryWallet = _newTreasury;
    }

    function updateBridgeWallet(address _newBridge) external onlyOwner {
        require(_newBridge != address(0), "Invalid address");
        bridgeWallet = _newBridge;
    }
}
