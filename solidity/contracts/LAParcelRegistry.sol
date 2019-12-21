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

  // mapping(bytes32 => LAParcel) parcels; // Mapping CSC => Parcels

  //
  // Events - publicize actions to external listeners
  //

  event LogParcelClaimed(bytes32 indexed csc, bytes15 indexed dggsIndex, bytes32 wkbHash,
                          string addr, string lbl, uint area, string parcelType, address owner);

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
  * @param extAddr External Address
  * @param label Parcel label
  * @param area Parcel Area
  * @param landUseCode land use code
  * @param cadastralType cadastral type (parcel / building)
  * @return the Crypto-Spatial Coordinate (CSC) of the feature
  */
  function claimParcel(bytes15 dggsIndex,
                       bytes32 wkbHash,
                       string memory extAddr,
                       string memory label,
                       uint area,
                       string memory landUseCode,
                       LAParcel.CadastralTypeCode cadastralType)
      public addFeature( dggsIndex, wkbHash, msg.sender)
      returns (bytes32) {

    // TODO check inputs

    LAParcel parcel = new LAParcel(dggsIndex,wkbHash, msg.sender, h3Resolution);
    bytes32 csc = parcel.getFeatureCSC();
    features[csc] = address(parcel);
    parcel.setParcelValues(label, extAddr, landUseCode, area, cadastralType);
    emit LogParcelClaimed(csc, dggsIndex, wkbHash, extAddr, label, area, landUseCode, msg.sender);
    return csc;
  }
}
