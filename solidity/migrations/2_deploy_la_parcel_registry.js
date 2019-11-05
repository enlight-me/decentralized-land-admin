const LAParcelRegistry = artifacts.require("./LAParcelRegistry");
const CSGeometryLib = artifacts.require("./geospatial/CSGeometryLib");

module.exports = function(deployer) {
  deployer.deploy(CSGeometryLib);
  deployer.link(CSGeometryLib, LAParcelRegistry);
  const h3Resolution = 15;
  const parcelRegistryName = "ParcelRegistry"
  const srs = "EPSG:3857" // WGS 84 / Pseudo-Mercator
  deployer.deploy(LAParcelRegistry, parcelRegistryName, h3Resolution, srs);
};
