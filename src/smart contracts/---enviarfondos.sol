// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";


contract EduchainFondos {
    IERC20 public token;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function recibirTokens() external {
        token.transferFrom(msg.sender, address(this), 1);
        // Realizar acciones adicionales después de recibir los tokens
    }
}
