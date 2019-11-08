pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LAParcelRegistry.sol";
import "../contracts/LAParcel.sol";


contract TestLAParcelRegistry {

  bytes32 wkbHash = bytes32("This is a Well Known Binary");

    string addr1 = "1, first street";
    string addr2 = "2, second street";
    string label1 = "I'm a parcel";
    string label2 = "I'm parcel 2";
    string parcel1Type = "Building";
    string parcel2Type = "Agriculture";

    bytes15 dggsIndex2 = bytes15("8f28347ad921c65");
    bytes15 dggsIndex1 = bytes15("8f283470d921c65");
    uint area = 20;

    function testH3ValueUsingDeployedContract() public {
    LAParcelRegistry meta = LAParcelRegistry(DeployedAddresses.LAParcelRegistry());

    Assert.equal(meta.h3Resolution(), uint(15), "H3 Resolution in not 15");
  }

  function testAddedParcelValuesUsingDeployedContract() public {

    LAParcelRegistry meta = LAParcelRegistry(DeployedAddresses.LAParcelRegistry());

    bytes32 csc1 = meta.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, parcel1Type);
    bytes32 csc2 = meta.claimParcel(dggsIndex2, wkbHash, addr2, label2, area, parcel2Type);

    Assert.notEqual(csc1, csc2, "The two CSCs shouldn't be equal");

    Assert.equal(meta.getFeatureCount(), uint(2), "The parcels count should be 2");

    LAParcel parcel1 = LAParcel(meta.getFeature(csc1));
    LAParcel parcel2 = LAParcel(meta.getFeature(csc2));
    (string memory addr, string memory lbl, uint ar, string memory ptype) = parcel1.fetchParcel();

    Assert.equal(addr, addr1, "The parcel address should be : 1, first street");
    Assert.equal(lbl, label1, "The parcel label should be : I'm a parcel");
    Assert.equal(ar, area, "The parcel area should be : 20");
    Assert.equal(ptype, parcel1Type, "The parcel tyep should be : Building");

    (addr, lbl, ar, ptype) = parcel2.fetchParcel();

    Assert.equal(addr, addr2, "The parcel address should be : 2, second street");
    Assert.equal(lbl, label2, "The parcel label should be : I'm parcel 2");
    Assert.equal(ar, area, "The parcel area should be : 20");
    Assert.equal(ptype, parcel2Type, "The parcel tyep should be : Agriculture");

  }
}
