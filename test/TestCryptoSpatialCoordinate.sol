pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CryptoSpatialCoordinate.sol";

contract TestCryptoSpatialCoordinate {
    function testCalcGeoHashUsingDeployedContract() public {
    CryptoSpatialCoordinate meta = CryptoSpatialCoordinate(DeployedAddresses.CryptoSpatialCoordinate());

    bytes32 geoHashText = "My location coordinates geoHash2";
    bytes32 geoHash = bytes32(geoHashText);
    bytes32 CSCIndex = keccak256(abi.encodePacked(this, geoHash));

    Assert.equal(meta.addCSCIndexedEntity(geoHash), CSCIndex, "CSC Index is correctlly calculated");
  }
}