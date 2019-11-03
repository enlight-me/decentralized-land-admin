/**
 * @title CryptoSpatialFeature Interface
 * @author BENAHMED DAHO Ali
 * @notice an Interface contract that specify the Spatial Feature
 *
 * @dev GM_Primitive (ISO 19107)
 *
 * TODO :
 *
*/

pragma solidity ^0.5.0;


import './CSGeometryLib.sol';

interface CSFeatureInterface {

    //
    // Functions
    //

    function getGeometryType() external returns (CSGeometryLib.CSGeometryType);

}
