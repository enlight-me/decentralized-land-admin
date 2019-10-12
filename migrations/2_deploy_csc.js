const CryptoSpatialCoordinate = artifacts.require("./CryptoSpatialCoordinate");


module.exports = function(deployer) {
  deployer.deploy(CryptoSpatialCoordinate);
};
