/**
 * @title Crypto-Spatial Feature Registry
 * @author BENAHMED DAHO Ali
 * @notice an abstract contract that implement a Geospatial Features Registry
 * @dev ...
 *
*/

pragma solidity ^0.5.0;

import './CSFeatureInterface.sol';
import './CSFeature.sol';
import './CSGeometryLib.sol';

contract CSFeatureRegistry {
  //
  // State variables
  //
  uint public h3Resolution; // H3 resolution (H3 is a compliant DGGS library)
  string public name;       // display name of the registry
  string public srs;        // Spatial Reference System
  uint256 featuresCount = 0; // Counter of the added features


  mapping(bytes32 => address) internal features; // Mapping CSC => Features contract address

  //
  // Events - publicize actions to external listeners
  //
  event LogNewFeatureAdded(string name, bytes32 csc, bytes15 dggsIndex, bytes32 wkbHash, address owner);

  //
  // Functions
  //

  /// @notice constuctor
  constructor (string memory _name, uint _h3Resolution, string memory _srs) public {
    require((_h3Resolution >= 0 && _h3Resolution < 16), "H3 Resolution must be _h3Resolution >=0 && _h3Resolution <16");
    require(bytes(_name)[0] != 0, "Empty name");

    h3Resolution = _h3Resolution;
    name = _name;
    srs = _srs;
    featuresCount = 0;
  }

  /**
  * @notice addFeature
  * @param dggsIndex dggsIndex of the feature
  * @param wkbHash Well Known Binary Hash
  * @return the Crypto-Spatial Coordinate (CSC) of the feature
  */
  modifier addFeature(bytes15 dggsIndex, bytes32 wkbHash, address _sender)
   {
    require(dggsIndex.length != 0, "Empty dggsIndex");
    require(wkbHash.length != 0, "Empty wkbHash");

    _;

    bytes32 csc = CSGeometryLib.computeCSCIndex(_sender, dggsIndex);
    emit LogNewFeatureAdded(name, csc, dggsIndex, wkbHash, _sender);
    featuresCount += 1; // TODO use SafeMath
  }

  // modifier addFeature(bytes15 dggsIndex,bytes32 wkbHash)
  //  {
  //   require(dggsIndex.length != 0, "Empty dggsIndex");
  //   require(wkbHash.length != 0, "Empty wkbHash");
  //   bytes32 csc = CSGeometryLib.computeCSCIndex(msg.sender, dggsIndex);
  //   faturesCount += 1; // TODO use SafeMath
  //   emit LogNewFeatureAdded(name, dggsIndex, csc, msg.sender);
  //    _;
  // }

 /**
  * @notice getFeatureCount
  * @return the count of the features added to the registry
  */
  function getFeatureCount() public view returns (uint256) {
    return featuresCount;
  }

  /**
  * @notice getFeature
  * @param csc the feature CSC
  * @return the address of the feature deployed contract
  */
  function getFeature(bytes32 csc) public view returns (address){
    require (features[csc] != address(0), "Feature does not exist in the registry");
    return  features[csc];
  }

  /**
  * @notice callback function
  */

  function () external {
    revert("this contract should never have a balance");
  }
}
