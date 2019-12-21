/*
 * @dev test file for LAParcelRegistry.sol
 * 
*/

let catchRevert = require("./exceptionHelpers").catchRevert
const truffleAssert = require('truffle-assertions');
var LAParcelRegistry = artifacts.require("./LAParcelRegistry.sol")
var LAParcel = artifacts.require("./LAParcel.sol")

contract('LAParcelRegistry', function (accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  const h3Resolution = 15;
  const parcelRegistryName = "TestParcelRegistry";
  const srs = "EPSG:6666";

  const dggsIndex1 = web3.utils.toHex("8f283470d921c65"); // must be 15 bytes
  const dggsIndex2 = web3.utils.toHex("8f28347ad921c65");

  const wkbHash = web3.utils.soliditySha3('This is a Well Known Binary');
  const addr1 = "1, first street";
  const addr2 = "2, second street";
  const label1 = "I'm a parcel";
  const label2 = "I'm parcel 2";
  const area = 20;
  const landUseCode1 = "Building";
  const landUseCode2 = "Agriculture";

  const CADASTRAL_TYPE_PARCEL = 0;
  const CADASTRAL_TYPE_BUILDING = 1;

  const cadastralType1 = CADASTRAL_TYPE_PARCEL;
  const cadastralType2 = CADASTRAL_TYPE_BUILDING;


  beforeEach(async () => {
    instance = await LAParcelRegistry.new(parcelRegistryName, h3Resolution, srs);
  })


  it("Should return the correct initial values of the state variables", async () => {
    let registryName = "Parcel Registry"
    let returnedName = await instance.name();
    let returnedH3Res = await instance.h3Resolution();
    let returnedSrs = await instance.srs();

    assert.equal(returnedName, registryName, "The parcel name should be " + parcelRegistryName);
    assert.equal(returnedH3Res, h3Resolution, "The resolution should be " + h3Resolution);
    assert.equal(returnedSrs, srs, "The SRS should be " + srs);
  });


  it("Should log an avent with the correct CSC when a new Feature is added", async () => {
    const index = web3.utils.soliditySha3({ type: 'address', value: owner },
                                          { type: 'bytes15', value: dggsIndex1 });

    const result = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1);

    const expectedEventResult = { csc: index };

    const logAddFeature = result.logs[3].args.csc;

    assert.equal(expectedEventResult.csc, logAddFeature, "LogAddFeature event not emitted with the correct CSC, check ClaimParcel method");
  });

  it("Should emit a LogParcelClaimed event when a Parcel is Claimed", async () => {
    let eventEmitted = false
    const tx = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1);

    if (tx.logs[2].event == "LogParcelClaimed") {
      eventEmitted = true;
    }

    assert.equal(eventEmitted, true, 'Claiming a parcel should emit a LogParcelClaimed event')
  });

  it("Shouldn't allow adding new parcel with the an existing dggsIndex", async () => {
    // The registry shouldn't allow two parcels with the same dggsIndex
    await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1);
    await truffleAssert.fails(instance.claimParcel(dggsIndex1, wkbHash, addr2, label2, area, landUseCode2, cadastralType1),
      truffleAssert.ErrorType.REVERT);
  });

  it("Should set the correct values for the new claimed parcel", async () => {
    const result1 = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1);
    const result2 = await instance.claimParcel(dggsIndex2, wkbHash, addr2, label2, area, landUseCode2, cadastralType2);

    const count = await instance.getFeatureCount();
    assert.equal(count, 2, "The parcels count should be 2");

    const csc1 = result1.logs[2].args.csc;
    const csc2 = result2.logs[2].args.csc;

    assert.notEqual(csc1, csc2, "The two CSCs shouldn't be equal");

    const feature1Address = await instance.getFeature(csc1);
    const feature2Address = await instance.getFeature(csc2);

    const parcel1 = await LAParcel.at(feature1Address);
    const parcel2 = await LAParcel.at(feature2Address);
    var parcel1Values = await parcel1.fetchParcel();
    var parcel2Values = await parcel2.fetchParcel();

    assert.equal(parcel1Values[1], label1, "The parcel label should be : " + label1);
    assert.equal(parcel1Values[2], addr1, "The parcel address should be : " + addr1);
    assert.equal(parcel1Values[3], landUseCode1, "The parcel type should be : " + landUseCode1);
    assert.equal(parcel1Values[4], area, "The parcel area should be :" + area);
    assert.equal(parcel1Values[5], cadastralType1, "The parcel cadastral Type should be :" + cadastralType1);

    assert.equal(parcel2Values[1], label2, "The parcel label should be : " + label2);
    assert.equal(parcel2Values[2], addr2, "The parcel address should be : " + addr2);
    assert.equal(parcel2Values[3], landUseCode2, "The parcel label should be : " + landUseCode2);
    assert.equal(parcel2Values[4], area, "The parcel area should be :" + area);
    assert.equal(parcel2Values[5], cadastralType2, "The parcel cadastral Type should be :" + cadastralType2);
  });

  it("Should returns true if dggsIndex exist in the registry", async () => {
    await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1);
    assert.equal(await instance.dggsIndexExist(dggsIndex1), true, "False returned for an existing dggsIndex");
  });

  it("Should returns the correct address of the dggsIndex owner", async () => {
    await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1, { from: alice });
    assert.equal(await instance.dggsIndexOwner(dggsIndex1), alice, "Returned address do not correspond to the dggsIndex owner");

    await instance.claimParcel(dggsIndex2, wkbHash, addr1, label1, area, landUseCode1, cadastralType1, { from: bob });
    assert.equal(await instance.dggsIndexOwner(dggsIndex2), bob, "Returned address do not correspond to the dggsIndex owner");
  });

  it("Should returns the owner of the parcel", async () => {
    const result = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1, { from: alice });

    const csc = result.logs[2].args.csc;

    const featureAddress = await instance.getFeature(csc);
    const parcel = await LAParcel.at(featureAddress);
    var parcelValues = await parcel.fetchFeature();

    assert.equal(parcelValues[3], alice, "The returned value do not correspond to the owner");
  });

  it("Should revert if the caller is not an Admin", async () => {
    const result = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1, { from: alice });

    const csc = result.logs[2].args.csc;

    const featureAddress = await instance.getFeature(csc);
    const parcel = await LAParcel.at(featureAddress);

    await truffleAssert.passes(parcel.setWkbHash(wkbHash, { from: alice }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.fails(parcel.setWkbHash(wkbHash, { from: bob }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.passes(parcel.setExtAddress(addr2, { from: alice }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.fails(parcel.setExtAddress(addr2, { from: bob }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.passes(parcel.setLabel(label2, { from: alice }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.fails(parcel.setLabel(label2, { from: bob }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.passes(parcel.setArea(area, { from: alice }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.fails(parcel.setArea(area, { from: bob }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.passes(parcel.setLandUseCode(landUseCode2, { from: alice }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.fails(parcel.setLandUseCode(landUseCode2, { from: bob }), truffleAssert.ErrorType.REVERT);

  });

  it("Should allow killing a feature by admins and log LogFeatureKilled", async () => {
    const result = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area, landUseCode1, cadastralType1,  { from: alice });

    const csc = result.logs[2].args.csc;

    const featureAddress = await instance.getFeature(csc);

    await truffleAssert.passes(LAParcel.at(featureAddress));

    await truffleAssert.fails(instance.removeFeature(csc, { from: bob }));

    const tx = await instance.removeFeature(csc, { from: alice }); // may test for owner too

    let eventEmitted = false
    if (tx.logs[0].event == "LogFeatureRemoved") {
      eventEmitted = true
    }

    assert.equal(eventEmitted, true, 'Removing a feature should emit a LogFeatureRemoved event')

    // no code should exist at the removed feature address
    await truffleAssert.fails(LAParcel.at(featureAddress));

  });

});