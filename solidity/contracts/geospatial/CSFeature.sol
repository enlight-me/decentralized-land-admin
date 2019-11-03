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

contract CSFeature is CSFeatureInterface {

    //
    // State variables
    //

    address public owner;       // owner
    bytes32 public csc;         // Crypto-Spatial Coordinate
    bytes32 public wkbHash;     // Well Known Binary Hash
    bytes15 public dggsIndex;   // DGGS (Disrcete Global Geodetic System) index
    uint public h3Resolution;   // H3 resolution (H3 is a compliant DGGS library)
    CSGeometryLib.CSGeometryType internal geomteryType; // geometry type

    //
    // Functions
    //

    /**
    * @notice constuctor
    * @dev initialize state variables
    *
    */
    constructor (bytes15 _dggsIndex, bytes32 _wkbHash, address __owner, uint _h3Resolution) public {
      require((_h3Resolution >= 0 && _h3Resolution < 16), "H3 Resolution must be _h3Resolution >=0 && _h3Resolution <16");
      require(dggsIndex.length != 0, "Empty dggsIndex");
      require(_wkbHash.length != 0, "Empty wkbHash");
      address _owner = __owner; // TODO change after inheriting from Ownable
      owner = _owner;
      wkbHash = _wkbHash;
      dggsIndex = _dggsIndex;
      geomteryType = CSGeometryLib.CSGeometryType.GM_POINT;
      h3Resolution = _h3Resolution;
      csc = CSGeometryLib.computeCSCIndex(_owner, _dggsIndex);
    }

  /**
   * @dev getGeometryType
   */
  function getGeometryType() external returns (CSGeometryLib.CSGeometryType) {
    return geomteryType;
  }
  function () external {
      revert("this contract should never have a balance");
    }

}
