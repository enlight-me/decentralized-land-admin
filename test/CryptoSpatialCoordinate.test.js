/*
 * @dev test file for CryptoSpatialCoordinate.sol
 * 
*/

var CryptoSpatialCoordinate = artifacts.require("./CryptoSpatialCoordinate.sol")

contract('CryptoSpatialCoordinate', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]
    const geoHashText = "My location coordinates geoHash2" // must be 32 bytes
    const geoHash = web3.utils.toHex(geoHashText)
  
    beforeEach(async () => {
      instance = await CryptoSpatialCoordinate.new()
    })
  
    it("should log a deposit event when a CSCIndex is added", async() => {
      const index  = web3.utils.soliditySha3({ type : 'address', value : owner}, 
                                             { type : 'bytes32', value : geoHash})
      const result  = await instance.addCSCIndexedEntity(geoHash)
      
      const expectedEventResult = {cscIndex : index}
  
      const logAccountCSCIndex = result.logs[0].args.cscIndex
    //   console.log(result.logs[0])
      assert.equal(expectedEventResult.cscIndex, logAccountCSCIndex, "LogCSCIndexedEntityAdded event cscIndex property not emitted, check deposit method");
    })
 
  })