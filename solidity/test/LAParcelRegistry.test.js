/*
 * @dev test file for LAParcelRegistry.sol
 * 
*/

let catchRevert = require("./exceptionHelpers").catchRevert
var LAParcelRegistry = artifacts.require("./LAParcelRegistry.sol")
var LAParcel = artifacts.require("./LAParcel.sol")

contract('LAParcelRegistry', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]

    const h3Resolution = 15;
    const parcelRegistryName = "TestParcelRegistry";
    const srs = "EPSG:6666";    
    
    const dggsIndex1 = web3.utils.toHex("8f283470d921c65"); // must be 15 bytes
    const dggsIndex2 = web3.utils.toHex("8f28347ad921c65");

    const wkbHash = web3.utils.soliditySha3('This is a Well Known Binary');
    var addr1 = "1, first street";
    var addr2 = "2, second street";
    var label1 = "I'm a parcel";
    var label2 = "I'm parcel 2";
    const area = 20;
  
    beforeEach(async () => {
      instance = await LAParcelRegistry.new(parcelRegistryName, h3Resolution, srs);
    })
    
    it("Should return the correct initial values of the state variables", async ()=> {
      let registryName = "Parcel Registry"
      let returnedName  = await instance.name(); 
      let returnedH3Res  = await instance.h3Resolution(); 
      let returnedSrs  = await instance.srs(); 
      // console.log(name);
      assert.equal(returnedName, registryName, "The parcel name should be " + parcelRegistryName);
      assert.equal(returnedH3Res, h3Resolution, "The resolution should be " + h3Resolution);
      assert.equal(returnedSrs, srs, "The SRS should be " + srs);
    });
  
      
    it("Should log an avent with the correct CSC when a new Feature is added", async() => {
      const index  = web3.utils.soliditySha3({ type : 'address', value : owner}, 
                                             { type : 'bytes15', value : dggsIndex1})
      const result  = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area)
      
      const expectedEventResult = {csc : index}
  
      const logAddFeature = result.logs[0].args.csc
      // console.log(result.logs[0].args);
      assert.equal(expectedEventResult.csc, logAddFeature, "LogAddFeature event not emitted with the correct CSC, check ClaimParcel method");
    });

    it("Should set the correct values for the new claimed parcel", async ()=> {
      const result1 = await instance.claimParcel(dggsIndex1, wkbHash, addr1, label1, area);
      const result2 = await instance.claimParcel(dggsIndex2, wkbHash, addr2, label2, area);
      
      const count  = await instance.getFeatureCount();
      assert.equal(count, 2, "The parcels count should be 2");

      const csc1 = result1.logs[1].args.csc;
      const csc2 = result2.logs[1].args.csc;

      assert.notEqual(csc1,csc2, "The two CSCs shouldn't be equal");

      const feature1Address  = await instance.getFeature(csc1);
      const feature2Address  = await instance.getFeature(csc2);


      const parcel1  = await LAParcel.at(feature1Address);
      const parcel2  = await LAParcel.at(feature2Address);
      const parcel1Addr = await parcel1.extAddressId();
      const parcel2Addr = await parcel2.extAddressId();
      const parcel1Label = await parcel1.label()
      const parcel2Label = await parcel2.label()

      assert.equal(parcel1Addr, addr1, "The parcel address should be : 1, first street");
      assert.equal(parcel2Addr, addr2, "The parcel address should be : 2, second street");
      assert.equal(parcel1Label, label1, "The parcel label should be : I'm parcel");
      assert.equal(parcel2Label, label2, "The parcel label should be : I'm parcel 2");      
    });
  })