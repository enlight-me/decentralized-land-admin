pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LAParcelRegistry.sol";
import "../contracts/LAParcel.sol";


contract TestLAParcelRegistry {
    function testH3ValueUsingDeployedContract() public {
    LAParcelRegistry meta = LAParcelRegistry(DeployedAddresses.LAParcelRegistry());

    Assert.equal(meta.h3Resolution(), uint(15), "H3 Resolution in not 15");
  }

  function testAddedParcelValuesUsingDeployedContract() public {
    bytes32 wkbHash = bytes32("This is a Well Known Binary");

    string memory addr1 = "1, first street";
    string memory addr2 = "2, second street";
    string memory label1 = "I'm a parcel";
    string memory label2 = "I'm parcel 2";
    uint area = 20;

    LAParcelRegistry meta = LAParcelRegistry(DeployedAddresses.LAParcelRegistry());
    bytes15 dggsIndex1 = bytes15("8f283470d921c65");
    bytes32 csc1 = meta.claimParcel(dggsIndex1, wkbHash, addr1, label1, area);

    bytes15 dggsIndex2 = bytes15("8f28347ad921c65");
    bytes32 csc2 = meta.claimParcel(dggsIndex2, wkbHash, addr2, label2, area);

    LAParcel parcel1 = LAParcel(meta.getFeature(csc1));
    LAParcel parcel2 = LAParcel(meta.getFeature(csc2));

    Assert.notEqual(csc1, csc2, "The two CSCs shouldn't be equal");

    Assert.equal(parcel1.extAddressId(), addr1, "The parcel address should be : 1, first street");
    Assert.equal(parcel2.extAddressId(), addr2, "The parcel address should be : 2, second street");
    Assert.equal(parcel1.label(), label1, "The parcel label should be : I'm parcel");
    Assert.equal(parcel2.label(), label2, "The parcel label should be : I'm parcel 2");
    Assert.equal(meta.getFeatureCount(), uint(2), "The parcels count should be 2");
  }
}
