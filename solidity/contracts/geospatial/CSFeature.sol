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
      require(dggsIndex.length != 0, "Empty dggsIndex");
      require(_wkbHash.length != 0, "Empty wkbHash");

      transferOwnership(__owner);
      wkbHash = _wkbHash;
      dggsIndex = _dggsIndex;
      geomteryType = CSGeometryLib.CSGeometryType.GM_POINT;
      h3Resolution = _h3Resolution;
      csc = CSGeometryLib.computeCSCIndex(__owner, _dggsIndex);
    }

  /**
   * @dev getGeometryType
   */
  function getGeometryType() external returns (CSGeometryLib.CSGeometryType) {
    return geomteryType;
  }
  /**
   */
  function getFeatureCSC() public view
      returns (bytes32 _csc) {
      return (csc);

    }
  /**
   * @dev returns all the values of the feature
   */
  function fetchFeature() public view
      returns (bytes32 _csc, bytes15 _dggsIndex, bytes32 _wkbHash, address __owner, uint _h3Resolution,
                CSGeometryLib.CSGeometryType _geomteryType) {
      return (csc,dggsIndex, wkbHash, owner(), h3Resolution, geomteryType);

    }
  /**
   * @dev update the Well Known Binary Hash of the feature
   */
  function setWkbHash(bytes32 _wkbHash) external onlyOwner()
      returns (bytes32 _wkbHashValue) {
    require(_wkbHash.length != 0, "Empty wkbHash");
    wkbHash = _wkbHash;
    return _wkbHash;
  }
  /**
   * @dev callback function
   */
  function () external {
      revert("this contract should never have a balance");
    }

}
