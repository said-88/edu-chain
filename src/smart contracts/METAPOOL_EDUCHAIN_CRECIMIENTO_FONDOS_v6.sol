// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract METAPOOL_EDUCHAIN_CRECIMIENTO_FONDOS {
    address public owner;
    uint256 public cambioFijoTemporalRate;

    // Mapeo de direcciones de usuario a la cantidad de stNEAR que poseen
    mapping(address => uint256) public saldo_actual;

    // Modificador para restringir el acceso a solo el propietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede realizar esta accion");
        _;
    }

    // Constructor: asigna el propietario inicial y establece la tasa de cambio estática
    constructor() {
        owner = msg.sender;
        cambioFijoTemporalRate = 100; // Valor inicial de la tasa de cambio
    }

    // Función para depositar_fondosar NEAR y recibir stNEAR
    function depositar_fondos(uint256 amount) public payable {
        // Transferir NEAR al contrato
        require(msg.value == amount, "Cantidad incorrecta de NEAR enviada");

        // Minter stNEAR para el usuario
        saldo_actual[msg.sender] += amount;

        // Emitir evento de depósito
        emit depositar_fondosed(msg.sender, amount);
    }

    // Función para retirar stNEAR y recibir NEAR
    function retirar_fondos(uint256 amount) public {
        // Quemar stNEAR del usuario
        saldo_actual[msg.sender] -= amount;

        // Transferir NEAR al usuario
        payable(msg.sender).transfer(amount);

        // Emitir evento de retiro
        emit retirar_fondosn(msg.sender, amount);
    }

    // Función para obtener la cantidad de NEAR que representa un stNEAR
    function obtenerNEARForstNEAR(uint256 amount) public view returns (uint256) {
        // Utilizar la tasa de cambio estática
        return amount * cambioFijoTemporalRate;
    }

    // Función para que el propietario actualice la tasa de cambio estática
    function updateExchangeRate(uint256 newRate) public onlyOwner {
        cambioFijoTemporalRate = newRate;
    }

    event depositar_fondosed(address indexed user, uint256 amount);
    event retirar_fondosn(address indexed user, uint256 amount);
}
