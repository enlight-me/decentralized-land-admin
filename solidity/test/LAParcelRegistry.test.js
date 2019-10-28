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

    const dggsIndexText = "8f283470d921c65" // must be 15 bytes
    const dggsIndex = web3.utils.toHex(dggsIndexText)
    const wkbHash = web3.utils.soliditySha3('This is a Well Known Binary')

    const h3Resolution = 15;
    const parcelRegistryName = "TestParcelRegistry";
    const srs = "EPSG:6666";

    const addr = "1, first street";
    const label = "I'm a parcel";
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
                                             { type : 'bytes15', value : dggsIndex})
      const result  = await instance.claimParcel(dggsIndex, wkbHash, addr, label, area)
      
      const expectedEventResult = {csc : index}
  
      const logAddFeature = result.logs[0].args.csc
      // console.log(result.logs[0].args);
      assert.equal(expectedEventResult.csc, logAddFeature, "LogAddFeature event not emitted with the correct CSC, check ClaimParcel method");
    });

    it("Should set the correct values for the new claimed parcel", async ()=> {
      const result1 = await instance.claimParcel(dggsIndex, wkbHash, addr, label, area);
      var lastAddress  = await instance.lastAddress();
      console.log(lastAddress);

      const dggsIndex2 = web3.utils.toHex("8f28347ad921c65") // must be 15 bytes
      const result2 = await instance.claimParcel(dggsIndex2, wkbHash, addr, "I'm parcel 2", area);
      
      const count  = await instance.getFeatureCount();
      assert.equal(count, 2, "The parcels count should be 2");

      lastAddress  = await instance.lastAddress();
      console.log(lastAddress);

      const csc1 = result1.logs[0].args.csc;
      const csc2 = result2.logs[0].args.csc;
      console.log(csc1);
      console.log(csc2);

      assert.notEqual(csc1,csc2, "The two CSCs shouldn't be equal");

      // const featureAdress  = await instance.getFeature(csc2, function(err, result){
      //   if(!err){
      //      console.log(result)
      //     } else {
      //       console.error(err);
      //     }
      // });

      // console.log(featureAdress);

      // const featureInstance  = await LAParcel.at(featureAdress);
      // let returnedH3Res  = await featureInstance.extAddressId(); 
      // let returnedArea  = await featureInstance.area(); 
      
    });
  })