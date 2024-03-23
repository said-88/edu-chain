
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EDUCHAIN_EAS {


  struct Estudiante {
    uint256 indiceAcademico;
    string nombre;
    uint256 dni;
    address wallet;
  }

  mapping(address => Estudiante) estudiantes;

  function agregarEstudiante(uint256 _indiceAcademico, string memory _nombre, uint256 _dni, address _wallet) public {
    require(_indiceAcademico >= 0 && _indiceAcademico <= 100, "Indice academico no valido");
    require(bytes(_nombre).length > 0, "Nombre no valido");
    require(_dni > 0, "DNI no valido");
    require(_wallet != address(0), "Wallet no valida");

    estudiantes[_wallet] = Estudiante(_indiceAcademico, _nombre, _dni, _wallet);
  }

  function obtenerEstudiante(address _wallet) public view returns (Estudiante memory) {
    return estudiantes[_wallet];
  }
}
