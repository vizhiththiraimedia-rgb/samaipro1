// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title SAMAI Daily Auto-Burner
 * @dev Locks a portion of SAMAI tokens (e.g., 7.5 Billion) and burns them 
 * progressively over a 10-year schedule to guarantee deflation.
 */
contract DailyAutoBurner {
    ERC20Burnable public immutable samaiToken;
    
    // 7.5 Billion divided by 3650 days (10 years) = ~2,054,794 tokens per day
    uint256 public constant DAILY_BURN_AMOUNT = 2_054_794 * 10**18; 
    uint256 public constant BURN_INTERVAL = 1 days;
    
    uint256 public lastBurnTimestamp;

    event TokensBurned(uint256 amount, uint256 timestamp);

    constructor(address _samaiToken) {
        require(_samaiToken != address(0), "Invalid token address");
        samaiToken = ERC20Burnable(_samaiToken);
        lastBurnTimestamp = block.timestamp; // Starts the 10-year clock
    }

    /**
     * @dev Anyone can call this function once a day to trigger the daily burn.
     * It burns strictly from the locked balance inside this contract.
     */
    function executeDailyBurn() external {
        require(block.timestamp >= lastBurnTimestamp + BURN_INTERVAL, "SAMAI: 24 hours have not passed yet");
        
        uint256 balance = samaiToken.balanceOf(address(this));
        require(balance > 0, "SAMAI: No more tokens left to burn");

        uint256 amountToBurn = DAILY_BURN_AMOUNT;
        
        // If the remaining balance is less than the daily amount, burn whatever is left
        if (balance < amountToBurn) {
            amountToBurn = balance;
        }

        // Update the timestamp to exactly 24 hours later
        lastBurnTimestamp += BURN_INTERVAL; 

        // Contract burns its own tokens, permanently removing them from supply
        samaiToken.burn(amountToBurn);

        emit TokensBurned(amountToBurn, block.timestamp);
    }

    /**
     * @dev View function to check how many tokens are currently locked.
     */
    function getLockedBalance() external view returns (uint256) {
        return samaiToken.balanceOf(address(this));
    }
}
