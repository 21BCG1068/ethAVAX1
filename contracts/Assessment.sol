

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = msg.sender;
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

        // Make sure this is the owner
        require(msg.sender == owner, "Not the correct owner");

        // Perform transaction
        balance += _amount;

        // Emit the event
        emit Deposit(_amount);

        // Assert transaction completed successfully
        assert(balance == _previousBalance + _amount);
    }

    // Custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "Not the correct owner of the account");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Withdraw the given amount
        balance -= _withdrawAmount;

        // Emit the event
        emit Withdraw(_withdrawAmount);

        // Assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));
    }
}
