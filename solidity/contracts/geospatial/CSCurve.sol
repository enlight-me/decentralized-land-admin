/**
 * @title CryptoSpatialCurve
 * @author BENAHMED DAHO Ali
 * @notice an abstract contract that implement a Spatial Curve Feature (Polyline)
 * on the etherurm blockchain
 *
 * @dev GM_CURVE (ISO 19107)
 *
*/

pragma solidity ^0.5.0;


import './CSGeometryLib.sol';
import './CSFeature.sol';

contract CSCurve is CSFeature {

    //
    // State variables
    //


    //
    // Functions
    //

    /**
    * @notice constuctor
    * @dev initialize state variables
    *
    */
    constructor (bytes15 _dggsIndex, bytes32 _wkbHash, address _owner, uint _h3Resolution) public
    CSFeature(_dggsIndex, _wkbHash, _owner,  _h3Resolution){
         geomteryType = CSGeometryLib.CSGeometryType.GM_CURVE;
    }

}
