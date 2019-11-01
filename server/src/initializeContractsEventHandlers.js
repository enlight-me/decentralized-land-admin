
var Web3 = require('web3');
const h3 = require("h3-js");
const spatialite = require('spatialite').verbose();
const db = new spatialite.Database('db.sqlite');

var CryptoSpatialCoordinateContract = require('../../client/src/contracts/CryptoSpatialCoordinate.json');


initializeContractsEventHandlers = async () => {
  try {
    web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:8545'));
    // Get the contract instance.
    const networkId = await web3.eth.net.getId();

    const deployedCSC = CryptoSpatialCoordinateContract.networks[networkId];
     instanceCSC = new web3.eth.Contract(
      CryptoSpatialCoordinateContract.abi,
      deployedCSC && deployedCSC.address,
    );
    // instanceCSC.events.LogCSCIndexedEntityAdded((err, events) => cscIndexAdded(err, events)).on('error', console.error);
    instanceCSC.events.LogCSCIndexedEntityAdded({
      // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0
      }, (err, events) => cscIndexAdded(err, events))
        .on("connected", function(subscriptionId){
            // console.log(subscriptionId);
        })
        .on('data', function(event){
            // console.log(event); // same results as the optional callback above
        })
        .on('changed', function(event){
            // remove event from local database
        })
        .on('error', console.error);

  } catch (error) {
    // Catch any errors for any of the above operations.
    console.log(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
  }

};

/**
 * @notice cscIndexAdded 
 */

cscIndexAdded = async (err, events) => {
    if (err) console.log("error" + err);

    const geoHash = web3.utils.hexToAscii(events.returnValues.geoHash);
    const hexCenterCoordinates = h3.h3ToGeo(geoHash);
    const position = ""+hexCenterCoordinates[0]+" "+hexCenterCoordinates[1];
  
    const ADD_QUERY = "INSERT INTO cscindex  (geohash, owner, cscindex, transhash, geometry) \
    VALUES ('"+events.returnValues.geoHash+"', '"+events.returnValues.owner+"', '"+events.returnValues.cscIndex+"', '"
    +events.transactionHash+"', GeomFromText('POINT("+position+")', 4326))";

    // console.log(ADD_QUERY);
    console.log("Event added new feature with geohash = "+ events.returnValues.geoHash);
  
    db.spatialite(function(err) {
      db.run(ADD_QUERY, (err, rows) => {
          if (err) {
          console.log(err)
        } 
      });
    });    
}

module.exports = initializeContractsEventHandlers;
