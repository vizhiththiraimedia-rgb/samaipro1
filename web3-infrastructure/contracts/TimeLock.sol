// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TimeLock
 * @dev A 48-hour Time-lock contract to safeguard administrative functions.
 * Sensitive transactions must be queued for at least 48 hours before execution.
 */
contract TimeLock {
    event QueueTransaction(bytes32 indexed txHash, address indexed target, uint value, string signature, bytes data, uint eta);
    event ExecuteTransaction(bytes32 indexed txHash, address indexed target, uint value, string signature, bytes data, uint eta);
    event CancelTransaction(bytes32 indexed txHash, address indexed target, uint value, string signature, bytes data, uint eta);
    event NewAdmin(address indexed newAdmin);

    address public admin; // Typically the Gnosis Safe 2-of-3 Multi-Sig address
    uint public constant GRACE_PERIOD = 14 days;
    uint public constant MINIMUM_DELAY = 48 hours; // 48-hour delay requirement

    mapping (bytes32 => bool) public queuedTransactions;

    modifier onlyAdmin() {
        require(msg.sender == admin, "TimeLock: Call must come from admin");
        _;
    }

    constructor(address _admin) {
        require(_admin != address(0), "TimeLock: Admin cannot be zero address");
        admin = _admin;
    }

    receive() external payable {}

    function setAdmin(address _newAdmin) external {
        require(msg.sender == address(this), "TimeLock: Call must come from TimeLock itself");
        admin = _newAdmin;
        emit NewAdmin(_newAdmin);
    }

    function queueTransaction(
        address target, 
        uint value, 
        string memory signature, 
        bytes memory data, 
        uint eta
    ) public onlyAdmin returns (bytes32) {
        require(eta >= block.timestamp + MINIMUM_DELAY, "TimeLock: Estimated execution time must satisfy delay");

        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = true;

        emit QueueTransaction(txHash, target, value, signature, data, eta);
        return txHash;
    }

    function cancelTransaction(
        address target, 
        uint value, 
        string memory signature, 
        bytes memory data, 
        uint eta
    ) public onlyAdmin {
        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = false;

        emit CancelTransaction(txHash, target, value, signature, data, eta);
    }

    function executeTransaction(
        address target, 
        uint value, 
        string memory signature, 
        bytes memory data, 
        uint eta
    ) public payable onlyAdmin returns (bytes memory) {
        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        require(queuedTransactions[txHash], "TimeLock: Transaction hasn't been queued");
        require(block.timestamp >= eta, "TimeLock: Transaction hasn't surpassed delay period");
        require(block.timestamp <= eta + GRACE_PERIOD, "TimeLock: Transaction is stale");

        queuedTransactions[txHash] = false;

        bytes memory callData;

        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
        }

        // Solady or standard call check
        (bool success, bytes memory returnData) = target.call{value: value}(callData);
        require(success, "TimeLock: Transaction execution reverted");

        emit ExecuteTransaction(txHash, target, value, signature, data, eta);

        return returnData;
    }
}
