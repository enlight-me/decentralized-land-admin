pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/geospatial/CSFeatureRegistry.sol";

contract TestCSFeatureRegistry {
    function testH3ValueUsingDeployedContract() public {
    CSFeatureRegistry meta = CSFeatureRegistry(DeployedAddresses.CSFeatureRegistry());

    // bytes32 geoHashText = "My location coordinates geoHash2";
    // bytes15 geoHash = bytes15(geoHashText);
    // bytes32 CSCIndex = keccak256(abi.encodePacked(this, geoHash));

    Assert.equal(meta.h3Resolution(), uint(10), "H3 Resolution in not 15");
  }
}