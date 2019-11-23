/**
 * @title CryptoSpatialFeature
 * @author BENAHMED DAHO Ali
 * @notice an abstract contract that implement a Spatial Feature Geometry
 * on the etherurm blockchain
 *
 * @dev GM_Primitive (ISO 19107)
 *
 * TODO :
 *  - make this contract Ownable
 *
*/

pragma solidity ^0.5.0;


import './CSGeometryLib.sol';
import './CSFeatureInterface.sol';
import '@openzeppelin/contracts/access/Roles.sol';
import '@openzeppelin/contracts/ownership/Ownable.sol';

contract CSFeature is CSFeatureInterface, Ownable {

    //
    // State variables
    //

    bytes32 internal csc;         // Crypto-Spatial Coordinate
    bytes32 internal wkbHash;     // Well Known Binary Hash
    bytes15 internal dggsIndex;   // DGGS (Disrcete Global Geodetic System) index
    uint internal h3Resolution;   // H3 resolution (H3 is a compliant DGGS library)
    CSGeometryLib.CSGeometryType internal geomteryType; // geometry type

    // adding access control
    using Roles for Roles.Role;

    Roles.Role private _admins;

  //
  // Events - publicize actions to external listeners
  //
    event LogFeatureCreated(bytes32 indexed csc, bytes15 indexed dggsIndex, bytes32 wkbHash, address indexed owner);
    event LogFeatureKilled(bytes32 indexed csc, bytes15 indexed dggsIndex, bytes32 wkbHash, address indexed owner);

    //
    // Modifiers
    //

    modifier onlyAdmins(address _address) {
      require(_admins.has(_address),"Caller haven't admins rights on the feature");
      _;
    }

    //
    // Functions
    //

    /**
    * @notice constuctor
    * @dev initialize state variables
    *
    */
    constructor (bytes15 _dggsIndex, bytes32 _wkbHash, address __owner, uint _h3Resolution) public Ownable() {
      require((_h3Resolution >= 0 && _h3Resolution < 16), "H3 Resolution must be _h3Resolution >=0 && _h3Resolution <16");
      require(_dggsIndex[0] != 0, "Empty dggsIndex");
      require(_wkbHash[0] != 0, "Empty wkbHash");

      transferOwnership(__owner);
      _admins.add(__owner);
      _admins.add(msg.sender);
      wkbHash = _wkbHash;
      dggsIndex = _dggsIndex;
      geomteryType = CSGeometryLib.CSGeometryType.GM_POINT;
      h3Resolution = _h3Resolution;
      csc = CSGeometryLib.computeCSCIndex(__owner, _dggsIndex);
      emit LogFeatureCreated(csc, dggsIndex, wkbHash, owner());
    }

  /**
   * @dev getGeometryType
   */
  function getGeometryType() external returns (CSGeometryLib.CSGeometryType) {
    return geomteryType;
  }

  /**
   */
  function getFeatureCSC() external view returns (bytes32) {
      return (csc);
    }

  /**
   */
  function getFeatureDGGSIndex() external view returns (bytes15) {
      return (dggsIndex);
    }

  /**
   * @dev returns all the values of the feature
   */
  function fetchFeature() external view
      returns (bytes32 _csc, bytes15 _dggsIndex, bytes32 _wkbHash, address __owner, uint _h3Resolution,
                CSGeometryLib.CSGeometryType _geomteryType) {
      return (csc,dggsIndex, wkbHash, owner(), h3Resolution, geomteryType);

    }
  /**
   * @dev update the Well Known Binary Hash of the feature
   */
  function setWkbHash(bytes32 _wkbHash) external
              onlyAdmins(msg.sender)
              returns (bytes32 _wkbHashValue) {

    require(_wkbHash[0] != 0, "Empty wkbHash");
    wkbHash = _wkbHash;
    return _wkbHash;
  }
  /**
   * @dev isAdmin : check if the addres is an admin of this feature
   *
   */
  function isAdmin(address _address) external view returns (bool) {
    return _admins.has(_address);
  }

  /**
   * @dev remove permanently the feature from the blockchain
   * TODO cross check with Registry removeFeature
   */

  function kill() external onlyAdmins(msg.sender) {
      selfdestruct(address(uint160(owner()))); // cast owner to address payable
      // TODO check if state variables values stay accessible after selfdestruct
      emit LogFeatureKilled(csc, dggsIndex, wkbHash, owner());
    }

  /**
   * @dev callback function
   */
  function () external {
      revert("this contract should never have a balance");
    }

}
