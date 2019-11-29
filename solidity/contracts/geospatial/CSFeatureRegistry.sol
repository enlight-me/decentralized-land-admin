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

import '@openzeppelin/contracts/lifecycle/Pausable.sol';
import '@openzeppelin/contracts/ownership/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract CSFeatureRegistry is Pausable, Ownable {

  // Use safe math for featureCount;
  using SafeMath for uint256;

  //
  // State variables
  //
  uint public h3Resolution; // H3 resolution (H3 is a compliant DGGS library)
  string public name;       // display name of the registry
  string public srs;        // Spatial Reference System
  uint256 internal featuresCount = 0; // Counter of the added features

  mapping(bytes32 => address) internal features;  // Mapping CSC => Features contract address
  mapping(bytes15 => bool) internal addedIndexes; // Mapping to keep trace of added indexes
  mapping(bytes15 => address) internal indexOwner;// Mapping to keep trace of DGGS indexes owners

  //
  // Events - publicize actions to external listeners
  //
  event LogNewFeatureAdded(string name, bytes32 indexed csc, bytes15 indexed dggsIndex, bytes32 wkbHash, address owner);
  event LogFeatureRemoved(string name, bytes32 indexed csc, bytes15 indexed dggsIndex, address killer);

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
    require(!paused(), "Contract is paused");
    require(dggsIndex.length != 0, "Empty dggsIndex");
    require(addedIndexes[dggsIndex] == false, "DGGS Index already exist");
    require(wkbHash.length != 0, "Empty wkbHash");

    _;

    addedIndexes[dggsIndex] = true;
    indexOwner[dggsIndex] = _sender;
    bytes32 csc = CSGeometryLib.computeCSCIndex(_sender, dggsIndex); // TODO chek for gas overburn
    emit LogNewFeatureAdded(name, csc, dggsIndex, wkbHash, _sender);
    featuresCount = featuresCount.add(1); // TODO chek for gas overburn
  }

  /**
   * @dev check if the feature already exist in the registry
   */
  modifier featureExist(bytes32 csc) {
    require (features[csc] != address(0), "Feature does not exist in the registry");
    _;
  }

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
  function getFeature(bytes32 csc) public view featureExist(csc) returns (address){
    return  features[csc];
  }

 /**
  * @dev dggsIndexExist : check if dggs allready exit in the registry
  * @param _dggsIndex the index to check
  */

  function dggsIndexExist(bytes15 _dggsIndex) public view returns (bool) {
    return ((addedIndexes[_dggsIndex] == true));
  }

 /**
  * @dev dggsIndexOwner : return the address of the dggsIndex Owner
  * @param _dggsIndex the index to fetch
  */

  function dggsIndexOwner(bytes15 _dggsIndex) public view returns (address) {
    return (indexOwner[_dggsIndex]);
  }

  /**
   * @dev remove permanently the feature from the registry
   */
  function removeFeature(bytes32 csc) external featureExist(csc) {
    require(!paused(), "Contract is paused");
    CSFeatureInterface feature = CSFeatureInterface(getFeature(csc));
    // TODO require msg.sender == feature.owner() and remove onlyOwner() modifier
    require(feature.isAdmin(msg.sender), "Sender not allowed to remove this feature");

    bytes15 dggsIndex = feature.getFeatureDGGSIndex();
    addedIndexes[dggsIndex] = false;
    indexOwner[dggsIndex] = address(0);
    featuresCount = featuresCount.sub(1); // TODO chek for gas overburn
    emit LogFeatureRemoved(name, csc, dggsIndex, msg.sender);
    feature.kill();
  }


  /**
  * @notice callback function
  */

  function () external {
    revert("this contract should never have a balance");
  }
}
