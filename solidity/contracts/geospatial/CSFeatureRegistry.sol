/**
 * @title Crypto-Spatial Feature Registry
 * @author BENAHMED DAHO Ali
 * @notice an abstract contract that implement a Geospatial Features Registry
 * @dev ...
 *
*/

pragma solidity ^0.5.0;

import './CSFeature.sol';
import './CSGeometryLib.sol';

contract CSFeatureRegistry {
  //
  // State variables
  //
  uint public h3Resolution; // H3 resolution (H3 is a compliant DGGS library)
  string public name;       // display name of the registry
  string public srs;       // Spatial Reference System

  mapping(bytes32 => CSFeature) features; // Mapping CSC => Features
  CSGeometryLib.CSGeometryType internal geomteryType; // geometry type

  //
  // Events - publicize actions to external listeners
  //
  event LogNewFeatureAdded(string name, bytes15 dggsIndex, bytes32 csc, address owner);

  //
  // Functions
  //

  /// @notice constuctor
  constructor (uint _h3Resolution, string memory _name, string memory _srs) public {
    require((_h3Resolution >= 0 && _h3Resolution < 16), "H3 Resolution must be _h3Resolution >=0 && _h3Resolution <16");
    require(bytes(_name)[0] != 0, "Empty name");

    h3Resolution = _h3Resolution;
    name = _name;
    srs = _srs;
  }

  /**
  * @notice addFeature
  * @param dggsIndex dggsIndex of the feature
  * @param wkbHash Well Known Binary Hash
  * @return the Crypto-Spatial Coordinate (CSC) of the feature
  */
  function addFeature(bytes15 dggsIndex,bytes32 wkbHash)
  public returns (bytes32 csc) {
    // TODO Check validity of external input
    require(dggsIndex.length != 0, "Empty dggsIndex");
    require(wkbHash.length != 0, "Empty wkbHash");
    csc = CSGeometryLib.computeCSCIndex(msg.sender, dggsIndex);

    features[csc] = new CSFeature(dggsIndex,wkbHash, h3Resolution);

    emit LogNewFeatureAdded(name, dggsIndex, csc, msg.sender);
  }

  /**
  * @notice getFeature
  */
  function getFeature(bytes32 csc) public view returns (CSFeature){
    return features[csc];
  }


  /**
  * @notice callback function
  */

function () external {
    revert("this contract should never have a balance");
  }

}
