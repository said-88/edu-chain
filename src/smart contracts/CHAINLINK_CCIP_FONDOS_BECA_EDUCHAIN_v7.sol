// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/utils/SafeERC20.sol";


contract CHAINLINK_CCIP_FONDOS_BECA_EDUCHAIN {
    using SafeERC20 for IERC20;

    error NotEnoughBalanceForFees(uint256 currentBalance, uint256 calculatedFees);
    error NotEnoughBalanceTokenForTransfer(uint256 currentBalance);
    error NothingToWithdraw();

    address public owner;
    IRouterClient private immutable ccipRouter;
    mapping(address => address) public tokenAddresses;
    uint64 public destinationChainSelector; 

    event TokenTransferred(
        bytes32 messageId,
        uint64 destinationChainSelector,
        address receiver,
        uint256 amount,
        uint256 ccipFee
    );

    constructor(
        address _ccipRouterAddress,
        address _linkAddress,
        address _usdcAddress,
        uint64 _destinationChainSelector
    ) {
        owner = msg.sender;
        ccipRouter = IRouterClient(_ccipRouterAddress);
        tokenAddresses[_usdcAddress] = _usdcAddress;
        tokenAddresses[_linkAddress] = _linkAddress;
        destinationChainSelector = _destinationChainSelector;
    }

    function EnviarTokens(
        address _receiver,
        uint256 _amount,
        address _token
    ) external returns (bytes32 messageId) {
        require(tokenAddresses[_token] != address(0), "Token not supported");

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({ gasLimit: 0 })
            ),
            feeToken: tokenAddresses[_token]
        });

        uint256 ccipFee = ccipRouter.getFee(
            destinationChainSelector,
            message
        );

        if (ccipFee > IERC20(tokenAddresses[_token]).balanceOf(address(this)))
            revert NotEnoughBalanceForFees(IERC20(tokenAddresses[_token]).balanceOf(address(this)), ccipFee);
        IERC20(tokenAddresses[_token]).approve(address(ccipRouter), ccipFee);

        if (_amount > IERC20(tokenAddresses[_token]).balanceOf(msg.sender))
            revert NotEnoughBalanceTokenForTransfer(IERC20(tokenAddresses[_token]).balanceOf(msg.sender));
        IERC20(tokenAddresses[_token]).safeTransferFrom(msg.sender, address(this), _amount);
        IERC20(tokenAddresses[_token]).approve(address(ccipRouter), _amount);

        messageId = ccipRouter.ccipSend(destinationChainSelector, message);

        emit TokenTransferred(
            messageId,
            destinationChainSelector,
            _receiver,
            _amount,
            ccipFee
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function Agregar_TokenAddress(address _token, address _tokenAddress) external onlyOwner {
        tokenAddresses[_token] = _tokenAddress;
    }

    function Seleccionar_Chain_id(uint64 _chainId) external onlyOwner {
        destinationChainSelector = _chainId;
    }

    function withdrawTokens(address _receiver, address _token) external onlyOwner {
        uint256 amount = IERC20(tokenAddresses[_token]).balanceOf(address(this));
        if (amount == 0) revert NothingToWithdraw();
        IERC20(tokenAddresses[_token]).transfer(_receiver, amount);
    }
}
