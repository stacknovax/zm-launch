// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {ERC7984} from "@openzeppelin/confidential-contracts/token/ERC7984/ERC7984.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialMeme is ERC7984, ZamaEthereumConfig {
    address public immutable creator;
    uint64 public immutable maxSupply;
    uint64 public totalMinted;

    error InvalidCreator();
    error InvalidTokenMetadata();
    error ZeroAmount();
    error MaxSupplyExceeded(uint64 requested, uint64 remaining);

    event FreeMint(address indexed minter, uint64 amount, euint64 encryptedAmount);

    constructor(
        string memory name_,
        string memory symbol_,
        uint64 maxSupply_,
        address creator_
    ) ERC7984(name_, symbol_, "") {
        if (creator_ == address(0)) {
            revert InvalidCreator();
        }
        if (bytes(name_).length == 0 || bytes(symbol_).length == 0) {
            revert InvalidTokenMetadata();
        }
        if (maxSupply_ == 0) {
            revert InvalidTokenMetadata();
        }
        creator = creator_;
        maxSupply = maxSupply_;
    }

    function remainingSupply() external view returns (uint64) {
        return maxSupply - totalMinted;
    }

    function freeMint(uint64 amount) external returns (euint64 minted) {
        if (amount == 0) {
            revert ZeroAmount();
        }
        uint64 remaining = maxSupply - totalMinted;
        if (amount > remaining) {
            revert MaxSupplyExceeded(amount, remaining);
        }
        totalMinted += amount;
        minted = _mint(msg.sender, FHE.asEuint64(amount));
        emit FreeMint(msg.sender, amount, minted);
    }
}
