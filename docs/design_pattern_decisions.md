# Desgin pattern decisions

The OnChain Land Administration dApp make use of the FOAM protocol


import '@openzeppelin/contracts/lifecycle/Pausable.sol';

contract CSFeatureRegistry is Pausable {

import '@openzeppelin/contracts/ownership/Ownable.sol';

contract CSFeature is CSFeatureInterface, Ownable {

      // Use safe math for featureCount;
  using Math for uint256;


  private variables 
  bytes32 internal csc;         // Crypto-Spatial Coordinate
    bytes32 internal wkbHash;     // Well Known Binary Hash
    bytes15 internal dggsIndex;   // DGGS (Disrcete Global Geodetic System) index
    uint internal h3Resolution;   // H3 resolution (H3 is a compliant DGGS library)
    CSGeometryLib.CSGeometryType internal geomteryType; // geometry type


