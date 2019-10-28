/**
 * @title Crypto-Spatial Parcels Registry
 * @author BENAHMED DAHO Ali
 * @notice an abstract contract that implement a Parcels Registry
 * @dev ...
 *
*/

pragma solidity ^0.5.0;

import './LAParcel.sol';
import './geospatial/CSFeatureRegistry.sol';

contract LAParcelRegistry is CSFeatureRegistry {
  //
  // State variables
  //

  address public lastAddress; // TODO remove

  // mapping(bytes32 => LAParcel) parcels; // Mapping CSC => Parcels

  //
  // Events - publicize actions to external listeners
  //

  //
  // Functions
  //

  /// @notice constuctor
  constructor (string memory _name, uint _h3Resolution, string memory _srs) public
  CSFeatureRegistry(_name,_h3Resolution,_srs) {
    name = "Parcel Registry";
  }

  /**
  * @notice addFeature modifier
  * @param dggsIndex dggsIndex of the feature
  * @param wkbHash Well Known Binary Hash
  * @param addr External Address ID
  * @param lbl Parcel label
  * @param area Parcel Area
  * @return the Crypto-Spatial Coordinate (CSC) of the feature
  */
  function claimParcel(bytes15 dggsIndex, bytes32 wkbHash, string memory addr, string memory lbl, uint area)
  public addFeature( dggsIndex, wkbHash)
  returns (bytes32) {
    LAParcel parcel = new LAParcel(dggsIndex,wkbHash, h3Resolution);
    bytes32 csc = parcel.csc();
    parcel.setExtAddressId(addr);
    parcel.setLabel(lbl);
    parcel.setArea(area);
    features[csc] = address(parcel);
    lastAddress = features[csc]; // temp
    return csc;
  }

}
