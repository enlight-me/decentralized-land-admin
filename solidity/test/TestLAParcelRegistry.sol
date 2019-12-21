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
    string landUseCode1 = "Building";
    string landUseCode2 = "Agriculture";

    bytes15 dggsIndex2 = bytes15("8f28347ad921c65");
    bytes15 dggsIndex1 = bytes15("8f283470d921c65");
    uint area = 20;

    LAParcel.CadastralTypeCode cadastralType1 = LAParcel.CadastralTypeCode.PARCEL;
    LAParcel.CadastralTypeCode cadastralType2 = LAParcel.CadastralTypeCode.BUILDING;

  function testH3ValueUsingDeployedContract() public {
    LAParcelRegistry meta = LAParcelRegistry(DeployedAddresses.LAParcelRegistry());

    Assert.equal(meta.h3Resolution(), uint(15), "H3 Resolution in not 15");
  }

  function testAddedParcelValuesUsingDeployedContract() public {

    LAParcelRegistry meta = LAParcelRegistry(DeployedAddresses.LAParcelRegistry());

    bytes32 csc1 = meta.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1);
    bytes32 csc2 = meta.claimParcel(dggsIndex2, wkbHash, addr2, label2, area, landUseCode2, cadastralType2);

    Assert.notEqual(csc1, csc2, "The two CSCs shouldn't be equal");

    Assert.equal(meta.getFeatureCount(), uint(2), "The parcels count should be 2");

    LAParcel parcel1 = LAParcel(meta.getFeature(csc1));
    LAParcel parcel2 = LAParcel(meta.getFeature(csc2));
    bytes32 csc;
    string memory lbl;
    string memory addr;
    string memory landUse;
    uint ar;
    LAParcel.CadastralTypeCode cadastralType;

    (csc, lbl, addr, landUse, ar, cadastralType) = parcel1.fetchParcel();

    Assert.equal(lbl, label1, "The parcel label should be : I'm a parcel");
    Assert.equal(addr, addr1, "The parcel address should be : 1, first street");
    Assert.equal(landUse, landUseCode1, "The parcel tyep should be : Building");
    Assert.equal(ar, area, "The parcel area should be : 20");

    (csc, lbl, addr, landUse, ar, cadastralType) = parcel2.fetchParcel();

    Assert.equal(lbl, label2, "The parcel label should be : I'm parcel 2");
    Assert.equal(addr, addr2, "The parcel address should be : 2, second street");
    Assert.equal(landUse, landUseCode2, "The parcel tyep should be : Agriculture");
    Assert.equal(ar, area, "The parcel area should be : 20");

  }
}
