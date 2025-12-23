// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {ConfidentialMeme} from "./ConfidentialMeme.sol";

contract ConfidentialMemeFactory {
    uint64 public constant DEFAULT_SUPPLY = 100000000;

    address[] private _allTokens;
    mapping(address creator => address[] tokens) private _tokensByCreator;

    error InvalidTokenMetadata();

    event TokenCreated(
        address indexed creator,
        address indexed token,
        string name,
        string symbol,
        uint64 maxSupply
    );

    function createToken(string calldata name, string calldata symbol, uint64 maxSupply) external returns (address token) {
        if (bytes(name).length == 0 || bytes(symbol).length == 0) {
            revert InvalidTokenMetadata();
        }
        uint64 supply = maxSupply == 0 ? DEFAULT_SUPPLY : maxSupply;
        token = address(new ConfidentialMeme(name, symbol, supply, msg.sender));
        _allTokens.push(token);
        _tokensByCreator[msg.sender].push(token);
        emit TokenCreated(msg.sender, token, name, symbol, supply);
    }

    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return _tokensByCreator[creator];
    }

    function getAllTokens() external view returns (address[] memory) {
        return _allTokens;
    }
}
