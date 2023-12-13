// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract ContractPrizedaw {
    address owner;
    address[] admins;

    struct Prizedaw {
        uint256 id;
        uint256 amountPoolA;
        uint256 amountPoolB;
        address[] usersPoolA;
        address[] usersPoolB;
        bool isFinished;
        uint256 currentRewardsPerUserPoolA;
        uint256 currentRewardsPerUserPoolB;
    }

    Prizedaw currentPrizedaw;
    mapping(address => uint256) public reawrdsPerUser;

    constructor() {
        owner = msg.sender;
        currentPrizedaw.isFinished = true;
    }

    event BuyedTicket(
        address userAddress,
        uint256 poolId,
        uint256 blocktimestamp
    );

    event Withdraw(
        address userAddress,
        uint256 value
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner is allowed to perform this action"
        );
        _;
    }

    modifier onlyAdminOrOwner() {
        address senderOfTx = msg.sender;
        if (checkForAdmin(senderOfTx)) {
            require(checkForAdmin(senderOfTx), "Caller not admin");
            _;
        } else if (senderOfTx == owner) {
            _;
        } else {
            revert(
                "modifier : revert happened because the originator of the transaction was not the admin, and furthermore he wasn't the owner of the contract, so he cannot run this function"
            );
        }
    }

    function checkForAdmin(address _user) public view returns (bool admin_) {
        assembly {
            admin_ := false
            for {
                let ii := 0
            } lt(ii, admins.slot) {
                ii := add(ii, 1)
            } {
                let slot := sload(admins.slot)
                let value := shr(mul(admins.offset, ii), slot)
                if eq(value, _user) {
                    admin_ := true
                }
            }
        }
    }

    function addAdmin(address newAdmin) public onlyOwner {
        admins.push(newAdmin);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getRewardsAvailable() public view returns (uint256) {
        return reawrdsPerUser[msg.sender];
    }

    function getCurrentPrizedaw() public view returns (Prizedaw memory) {
        return currentPrizedaw;
    }

    function createPrizedaw(uint256 id) public onlyAdminOrOwner {
        require(
            currentPrizedaw.isFinished == true,
            "To create a new prizedaw you should finished the current"
        );

        currentPrizedaw.id = id;
        currentPrizedaw.isFinished = false;
    }

    function buyTicket(uint8 poolId) external payable {
        require(msg.value > 0, "Zero ether not allowed");

        if (poolId == 1) {
            currentPrizedaw.amountPoolA =
                currentPrizedaw.amountPoolA +
                msg.value;
            currentPrizedaw.usersPoolA.push(msg.sender);
        } else if (poolId == 2) {
            currentPrizedaw.amountPoolB =
                currentPrizedaw.amountPoolB +
                msg.value;
            currentPrizedaw.usersPoolB.push(msg.sender);
        }

        if (currentPrizedaw.usersPoolA.length > 0) {
            currentPrizedaw.currentRewardsPerUserPoolA =
                (currentPrizedaw.amountPoolA + currentPrizedaw.amountPoolB) /
                currentPrizedaw.usersPoolA.length;
        }

        if (currentPrizedaw.usersPoolB.length > 0) {
            currentPrizedaw.currentRewardsPerUserPoolB =
                (currentPrizedaw.amountPoolA + currentPrizedaw.amountPoolB) /
                currentPrizedaw.usersPoolB.length;
        }

        emit BuyedTicket(msg.sender, poolId, block.timestamp);
    }

    function finishCurrentPrizedaw() public onlyAdminOrOwner {
        uint randomNumber = 0;
        randomNumber =
            uint(
                keccak256(
                    abi.encodePacked(msg.sender, block.timestamp, randomNumber)
                )
            ) %
            1000;

        if (randomNumber % 2 == 0) {
            for (
                uint256 index = 0;
                index < currentPrizedaw.usersPoolA.length;
                index++
            ) {
                reawrdsPerUser[
                    currentPrizedaw.usersPoolA[index]
                ] += currentPrizedaw.currentRewardsPerUserPoolA;
            }
        } else {
            for (
                uint256 index = 0;
                index < currentPrizedaw.usersPoolB.length;
                index++
            ) {
                reawrdsPerUser[
                    currentPrizedaw.usersPoolB[index]
                ] += currentPrizedaw.currentRewardsPerUserPoolB;
            }
        }

        currentPrizedaw.amountPoolA = 0;
        currentPrizedaw.amountPoolB = 0;
        currentPrizedaw.currentRewardsPerUserPoolA = 0;
        currentPrizedaw.currentRewardsPerUserPoolB = 0;
        currentPrizedaw.id = 0;
        currentPrizedaw.isFinished = true;
        delete currentPrizedaw.usersPoolA;
        delete currentPrizedaw.usersPoolB;
    }

    function withdraw() external payable {
        uint256 reward = reawrdsPerUser[msg.sender];
        reawrdsPerUser[msg.sender] = 0;

        payable(msg.sender).transfer(reward);

        emit Withdraw(msg.sender, reward);
    }
}
