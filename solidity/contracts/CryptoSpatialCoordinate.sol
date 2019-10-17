/**
 * @title CryptoSpatialCoordinate
 * @dev standard Crypto Spatial Coordinate library
 * @notice This contract implement the Crypto Spatial Coordinate
 *  as described by the FOAM protocole
 * Requirements:
 * - ....
 *
*/

pragma solidity ^0.5.0;

contract CryptoSpatialCoordinate {
    //
    // State variables
    //
    address public owner;

    struct CSCIndex {
    address owner;
    bytes32 geoHash;
    bytes32 cscIndex;
    }

    //
    // Events - publicize actions to external listeners
    //
    event LogCSCIndexedEntityAdded(bytes32 cscIndex, bytes32 geoHash, address owner);
    event Deposit(address sender, uint value);
    //
    // Functions
    //

    /// @notice constuctor
    constructor () public {
      owner = msg.sender;
    }

    /// @notice addCSCIndexedEntity
    /// @param _geoHash geoHash of the geospatialy referenced entity
    function addCSCIndexedEntity(bytes32 _geoHash)
    public returns (bytes32 cscIndex) {
      // TODO Check validity of external input
      cscIndex = calcCSCIndex (msg.sender, _geoHash);
      emit LogCSCIndexedEntityAdded(cscIndex, _geoHash, owner);
    }

    /**
    * @dev calculate the CSC Index using ...
    * @notice calcCSCIndex
    * @param _owner the owner of the CSC
    * @param _geoHash the geoHash of the geospatialy referenced entity
    */
    function calcCSCIndex (address _owner, bytes32 _geoHash)
    internal pure
    returns (bytes32) {
      return keccak256(abi.encodePacked(_owner, _geoHash));
    }

    /// @notice isCSCIndex
    /// @param  _owner the owner of the entity
    /// @param  _geoHash geoHash of the geospatialy referenced entity
    /// @param  _cscIndex the CSC Index
    function isValidCSCIndex(address _owner, bytes32 _geoHash, bytes32 _cscIndex)
    public pure returns (bool) {
      return (_cscIndex == calcCSCIndex (_owner, _geoHash));
    }

    /// @notice isMyCSCIndex
    /// @param  _geoHash geoHash of the geospatialy referenced entity
    /// @param  _cscIndex the CSC Index
    function isMyCSCIndex(bytes32 _geoHash, bytes32 _cscIndex)
    public view returns (bool) {
      return (_cscIndex == calcCSCIndex (msg.sender, _geoHash));
    }

      function () external {
      revert("this contract should never have a balance");
    }

}
