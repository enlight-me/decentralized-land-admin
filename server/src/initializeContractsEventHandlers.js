
var Web3 = require('web3');
const h3 = require('h3-js');
const spatialite = require('spatialite').verbose();
const db = new spatialite.Database('db.sqlite');

var LAParcelRegistry = require("../../client/src/contracts/LAParcelRegistry.json");

initializeContractsEventHandlers = async () => {
  try {
    // for the Rinkeby testnet 
    /*
    const providerPath = `wss://rinkeby.infura.io/ws`
    web3 = new Web3() 
    const eventProvider = new Web3.providers.WebsocketProvider(providerPath)

    //listen for disconnects
    eventProvider.on('error', e => handleDisconnects(e));
    eventProvider.on('end', e => handleDisconnects(e))

    web3.setProvider(eventProvider)

    function handleDisconnects(e) {
      console.log("error",e);
    }
    */

    // for the local ganache-cli network 
    web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:8545'));
    
    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedParcelReg = LAParcelRegistry.networks[networkId];
    const contractParcelReg = new web3.eth.Contract(
      LAParcelRegistry.abi,
      deployedParcelReg && deployedParcelReg.address,
    );      
    contractParcelReg.events.LogNewFeatureAdded((err, events) => cscIndexAdded(err, events))
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
    // LogNewFeatureAdded(string name, bytes32 csc, bytes15 dggsIndex, bytes32 wkbHash, address owner);

    if (err) console.log("error" + err);

    const dggsIndex = web3.utils.hexToUtf8(events.returnValues.dggsIndex);
    const regName = web3.utils.hexToUtf8(events.returnValues.name);
    const hexCenterCoordinates = h3.h3ToGeo(dggsIndex);
    const position = ""+hexCenterCoordinates[1]+" "+hexCenterCoordinates[0];
  
    const ADD_QUERY = `INSERT INTO features  (reg_name, dggs_index, owner, csc, wkb_hash, transhash, geometry)
                      VALUES ('${regName}',
                              '${dggsIndex}',
                              '${events.returnValues.owner}',
                              '${events.returnValues.csc}',
                              '${events.returnValues.wkbHash}',
                              '${events.transactionHash}',
                              GeomFromText('POINT(${position})', 4326))`;

    // console.log(ADD_QUERY);
    console.log("Event added new feature at position :" + position +"\n CSC = "+ events.returnValues.csc);
  
    db.spatialite(function(err) {
      db.run(ADD_QUERY, (err, rows) => {
          if (err) {
          console.log(err)
        } 
      });
    });    
}

module.exports = initializeContractsEventHandlers;
