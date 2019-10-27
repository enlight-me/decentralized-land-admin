/*
 * @dev test file for CryptoSpatialCoordinate.sol
 * 
*/

let catchRevert = require("./exceptionHelpers").catchRevert
var CSFeatureRegistry = artifacts.require("./geospatial/CSFeatureRegistry.sol")

contract('CSFeatureRegistry', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]

    const h3IndexText = "8f283470d921c65" // must be 15 bytes
    const h3Index = web3.utils.toHex(h3IndexText)
    const wkbHash = web3.utils.soliditySha3('This is a Well Known Binary')
    const h3Resolution = 15;
    const featureRegistryName = "TestFeatureClass"
    const srs = "EPSG:6666"
  
    beforeEach(async () => {
      instance = await CSFeatureRegistry.new(h3Resolution , featureRegistryName, srs);
    })
    
  
    it("should log an avent when a new Feature is added", async() => {
      const index  = web3.utils.soliditySha3({ type : 'address', value : owner}, 
                                             { type : 'bytes15', value : h3Index})
      const result  = await instance.addFeature(h3Index, wkbHash)
      
      const expectedEventResult = {csc : index}
  
      const logAddFeature = result.logs[0].args.csc
      assert.equal(expectedEventResult.csc, logAddFeature, "LogAddFeature event not emitted, check AddFeature method");
    })

  })