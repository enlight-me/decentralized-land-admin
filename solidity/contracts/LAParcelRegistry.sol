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

  mapping(bytes32 => LAParcel) parcels; // Mapping CSC => Parcels

  //
  // Events - publicize actions to external listeners
  //

  //
  // Functions
  //

  /// @notice constuctor
  constructor (uint _h3Resolution, string memory _name, string memory _srs) public
  CSFeatureRegistry(_h3Resolution,_name,_srs) {
    name = "Parcel Registry";
  }

  /**
  * @notice addFeature
  * @param dggsIndex dggsIndex of the feature
  * @param wkbHash Well Known Binary Hash
  * @param _addr External Address ID
  * @param _lbl Parcel label
  * @param _area Parcel Area
  * @return the Crypto-Spatial Coordinate (CSC) of the feature
  */
  function claimParcel(bytes15 dggsIndex,bytes32 wkbHash, string memory _addr, string memory _lbl, uint _area)
  public addFeature( dggsIndex, wkbHash)
  returns (bytes32 csc) {
    LAParcel parcel = new LAParcel(dggsIndex,wkbHash, h3Resolution);
    parcel.setExtAddressId(_addr);
    parcel.setLabel(_lbl);
    parcel.setArea(_area);
    parcels[csc] = parcel;
  }

  /**
  * @notice getFeature
  */
  function getFeature(bytes32 csc) public view returns (LAParcel){
    return parcels[csc];
  }


}
