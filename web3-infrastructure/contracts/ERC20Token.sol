// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SAM AI Utility Token
 * @dev Custom ERC20 token for SAM AI ecosystem. 
 * Includes deflationary burning, initial 30 Billion supply, and Trading Lock.
 */
contract SAMAIUtilityToken is ERC20, ERC20Burnable, Ownable {
    
    // Max supply set to 30 Billion tokens
    uint256 public constant MAX_SUPPLY = 30_000_000_000 * 10**18;
    
    // Trading Lock feature to prevent public trading until the pool is large enough
    bool public tradingEnabled = false;

    // Addresses exempt from the trading lock (e.g. Owner, Auto-Liquidity Contract)
    mapping(address => bool) public isExemptFromPause;

    // Minter address (usually the platform backend contract)
    mapping(address => bool) public isMinter;

    event MinterStatusChanged(address indexed minter, bool status);
    event TradingEnabled();

    modifier onlyMinter() {
        require(isMinter[msg.sender] || owner() == msg.sender, "SAMAI: Caller is not a minter or owner");
        _;
    }

    constructor() ERC20("SAM AI Token", "SAMAI") Ownable(msg.sender) {
        // Mint initial supply of 30 Billion tokens to owner for Liquidity & Treasury
        _mint(msg.sender, MAX_SUPPLY);
        
        isMinter[msg.sender] = true;
        
        // Owner is exempt from trading lock so they can add Liquidity
        isExemptFromPause[msg.sender] = true;
    }

    /**
     * @dev Enable public trading. Once enabled, it cannot be disabled.
     */
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "SAMAI: Trading is already enabled");
        tradingEnabled = true;
        emit TradingEnabled();
    }

    /**
     * @dev Set exempt status for contracts (like PaymentSplitter or Liquidity Router)
     */
    function setExemptFromPause(address account, bool status) external onlyOwner {
        isExemptFromPause[account] = status;
    }

    /**
     * @dev Set minter role status for contracts
     */
    function setMinterStatus(address minter, bool status) external onlyOwner {
        isMinter[minter] = status;
        emit MinterStatusChanged(minter, status);
    }

    /**
     * @dev Override _update to enforce the trading lock
     * OpenZeppelin 5.x uses _update for all transfers, mints, and burns
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        // Allow minting and burning (from = 0 or to = 0)
        // If it's a regular transfer, check if trading is enabled or sender is exempt
        if (from != address(0) && to != address(0)) {
            require(tradingEnabled || isExemptFromPause[from] || isExemptFromPause[to], 
                "SAMAI: Public trading is currently locked");
        }
        
        super._update(from, to, value);
    }
}
