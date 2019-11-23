pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import '../contracts/geospatial/CSGeometryLib.sol';


contract TestCSGeometryLib {

    bytes15 dggsIndex = bytes15("8f28347ad921c65");
    bytes32 internal csc;         // Crypto-Spatial Coordinate

  function testCalcCSC(bytes15 _dggsIndex) private view returns (bytes32) {
    return  CSGeometryLib.computeCSCIndex(msg.sender, _dggsIndex);
  }

  function testCallCalcCSCUsingDeployedContract() public {
    csc = testCalcCSC(dggsIndex);
    assert(csc[0] != 0);
  }

}
