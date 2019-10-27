const CSFeatureRegistry = artifacts.require("./geospatial/CSFeatureRegistry");
const CSGeometryLib = artifacts.require("./geospatial/CSGeometryLib");


module.exports = function(deployer) {
  deployer.deploy(CSGeometryLib);
  deployer.link(CSGeometryLib, CSFeatureRegistry);
  deployer.deploy(CSFeatureRegistry,15, "TestFeatureClass", "EPSG:6666");
};
