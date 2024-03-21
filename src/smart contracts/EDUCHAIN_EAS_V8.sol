// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract EDUCHAIN_EAS {
    
    // Dirección del contrato de EAS, para invocar sus funciones
    address public easContractAddress = 0xC2679fBD37d54388Ce493F1DB75320D236e1815e;
    // UID del esquema en EAS, clave de interacción con el smartcontract y el Eas
    bytes32 public schemaUID = 0x3969bb076acfb992af54d51274c5c868641ca5344e1aacd0b1f5e4f80ac0822f;
    
    address public owner;

    // sacamos los directores autorizados, con su wallet por institución
    mapping(address => Director) public directores;

    // sacamos profesores autorizados, con su wallet, cada profe viene de un director y puede atestar en favor de un estudiante
    mapping(address => Profesor) public profesores;

    // Auditores externos autorizados como parte de la transparencia con la idea que nos validen cada caso
    mapping(address => AuditorExterno) public auditoresExternos;

    //validaciones de caso para obtener si fue aprobado o no 
    mapping(address => ValidacionCaso) public validacionesCasos;

    // Evento para notificar cuando se agregue un estudiante y poder conectarlo con una interfaz gráfica 
    event EstudianteAgregado(address indexed wallet, string nombre, uint256 indiceAcademico, uint256 dni);
    
    // Evento para notificar cuando se agregue un director
    event DirectorAgregado(address indexed wallet, string instituto, string nombreCompleto, uint256 dni);

    // Evento para notificar cuando se agregue un profesor
    event ProfesorAgregado(address indexed wallet, string nombre, uint256 dni, address walletEstudiante, string mereceBecaPor);

    // Evento para notificar cuando se agregue un auditor externo
    event AuditorExternoAgregado(address indexed walletAuditor, string nombreAuditor);

    // Evento para notificar cuando se valide un caso
    event CasoValidado(address indexed walletEstudiante, string resumeInformacionCaso, bool validarCaso);

//OJO Revisar con WAKU si podemos disparar una notificación


    struct Estudiante {
        uint256 indiceAcademico;
        string nombre;
        uint256 dni;
        address wallet;
        bool mereceBeca;
        address walletInstitucionEducativa;
    }

    struct Director {
        string instituto;
        string nombreCompleto;
        uint256 dni;
        address wallet;
        address walletInstitucionEducativa;
    }

    struct Profesor {
        string nombre;
        uint256 dni;
        address wallet;
        address walletEstudiante;
        string mereceBecaPor;
        address walletInstitucionEducativa;
    }

    struct AuditorExterno {
        string nombreAuditor;
        address walletAuditor;
    }

    struct ValidacionCaso {
        address walletEstudiante;
        string resumeInformacionCaso;
        bool validarCaso;
    }

    // Mapeo de estudiantes
    mapping(address => Estudiante) public estudiantes;

    constructor() {
        owner = msg.sender;
    }

    // Modificador para permitir solo al propietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede realizar esta operacion");
        _;
    }

    // Función para agregar un estudiante limitada solo para directores y el propietario
    function agregarEstudiante(uint256 _indiceAcademico, string memory _nombre, uint256 _dni, address _wallet, address _walletInstitucionEducativa) public onlyDirectoresOrOwner {
        require(_indiceAcademico >= 0 && _indiceAcademico <= 100, "Indice academico no valido");
        require(bytes(_nombre).length > 0, "Nombre no valido");
        require(_dni > 0, "DNI no valido");
        require(_wallet != address(0), "Wallet no valida");

        estudiantes[_wallet] = Estudiante(_indiceAcademico, _nombre, _dni, _wallet, false, _walletInstitucionEducativa);

        emit EstudianteAgregado(_wallet, _nombre, _indiceAcademico, _dni);

        // Integración con EAS
        (bool success, ) = easContractAddress.call(
            abi.encodeWithSignature("attest(bytes32, bytes)", schemaUID, abi.encode(_wallet, _nombre, _indiceAcademico, _dni))
        );
        require(success, "Fallo de integracion con EAS");
    }

    // Función para agregar un director
    function agregarDirector(string memory _instituto, string memory _nombreCompleto, uint256 _dni, address _wallet, address _walletInstitucionEducativa) public onlyOwner {
        require(bytes(_instituto).length > 0, "Instituto no valido");
        require(bytes(_nombreCompleto).length > 0, "Nombre completo no valido");
        require(_dni > 0, "DNI no valido");
        require(_wallet != address(0), "Wallet no valida");

        directores[_wallet] = Director(_instituto, _nombreCompleto, _dni, _wallet, _walletInstitucionEducativa);

        emit DirectorAgregado(_wallet, _instituto, _nombreCompleto, _dni);

        // Integración con EAS
        (bool success, ) = easContractAddress.call(
            abi.encodeWithSignature("attest(bytes32, bytes)", schemaUID, abi.encode(_wallet, _instituto, _nombreCompleto, _dni, _walletInstitucionEducativa))
        );
        require(success, "Fallo de integracion con EAS");
    }

    // Función para agregar un profesor
    function agregarProfesor(string memory _nombre, uint256 _dni, address _walletEstudiante, string memory _mereceBecaPor, address _walletInstitucionEducativa) public onlyProfesoresOrOwner {
        require(bytes(_nombre).length > 0, "Nombre no valido");
        require(_dni > 0, "DNI no valido");
        require(_walletEstudiante != address(0), "Wallet del estudiante no valida");
        require(bytes(_mereceBecaPor).length > 0, "Razon de la beca no valida");

        profesores[msg.sender] = Profesor(_nombre, _dni, msg.sender, _walletEstudiante, _mereceBecaPor, _walletInstitucionEducativa);

        emit ProfesorAgregado(msg.sender, _nombre, _dni, _walletEstudiante, _mereceBecaPor);
    
    // Integración con EAS
        (bool success, ) = easContractAddress.call(
            abi.encodeWithSignature("attest(bytes32, bytes)", schemaUID, abi.encode(msg.sender, _nombre, _dni, _walletEstudiante, _mereceBecaPor, _walletInstitucionEducativa))
        );
        require(success, "Fallo de integracion con EAS");
    
    
    }

    // Función para agregar un auditor externo, solo puede ser creado por el owner del contrato
    function agregarAuditorExterno(string memory _nombreAuditor, address _walletAuditor) public onlyOwner {
        auditoresExternos[_walletAuditor] = AuditorExterno(_nombreAuditor, _walletAuditor);

        emit AuditorExternoAgregado(_walletAuditor, _nombreAuditor);
    
            // Integración con EAS
        (bool success, ) = easContractAddress.call(
            abi.encodeWithSignature("attest(bytes32, bytes)", schemaUID, abi.encode(_walletAuditor, _nombreAuditor))
        );
        require(success, "Fallo de integracion con EAS");
    
    }

    // Función para validar un caso, solo puede ser realizada por el auditor externo o el owner
    function validarCaso(address _walletEstudiante, string memory _resumeInformacionCaso, bool _validarCaso) public {
        require(msg.sender == owner || auditoresExternos[msg.sender].walletAuditor != address(0), "Solo el owner del contrato o un auditor externo pueden validar un caso");

        validacionesCasos[_walletEstudiante] = ValidacionCaso(_walletEstudiante, _resumeInformacionCaso, _validarCaso);

        emit CasoValidado(_walletEstudiante, _resumeInformacionCaso, _validarCaso);
    
    
    // Integración con EAS
        (bool success, ) = easContractAddress.call(
            abi.encodeWithSignature("attest(bytes32, bytes)", schemaUID, abi.encode(_walletEstudiante, _resumeInformacionCaso, _validarCaso))
        );
        require(success, "Fallo de integracion con EAS");


    }

    // Función para obtener información de un estudiante
    function obtenerEstudiante(address _wallet) public view returns (Estudiante memory) {
        return estudiantes[_wallet];
    }

    // Función para obtener información de un director
    function obtenerDirector(address _wallet) public view returns (Director memory) {
        return directores[_wallet];
    }

    // Función para obtener información de un profesor
    function obtenerProfesor(address _wallet) public view returns (Profesor memory) {
        return profesores[_wallet];
    }

    // Función para obtener información de auditor externo
    function obtenerAuditorExterno(address _walletAuditor) public view returns (AuditorExterno memory) {
        return auditoresExternos[_walletAuditor];
    }

    // Función para obtener información de una validación de caso
    function obtenerValidacionCaso(address _walletEstudiante) public view returns (ValidacionCaso memory) {
        return validacionesCasos[_walletEstudiante];
    }

    // Modificador para permitir solo a los directores y al propietario
    modifier onlyDirectoresOrOwner() {
        require(msg.sender == owner || directores[msg.sender].wallet != address(0), "Solo los directores y el propietario pueden realizar esta operacion");
        _;
    }

    // Modificador para permitir solo a los profesores y al propietario
    modifier onlyProfesoresOrOwner() {
        require(msg.sender == owner || profesores[msg.sender].wallet != address(0), "Solo los profesores y el propietario pueden realizar esta operacion");
        _;
    }
}
