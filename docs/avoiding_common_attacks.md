
MythX
truffle run verify

safemath

use mythtril

import '@openzeppelin/contracts/math/SafeMath.sol';

contract CSFeatureRegistry is Pausable, Ownable {

  // Use safe math for featureCount;
  using SafeMath for uint256;

