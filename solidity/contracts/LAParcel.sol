/**
 * @title Land Administration Parcel
 * @author BENAHMED DAHO Ali
 * @notice a Crypto-Spatial Features registry for land parcels
 * on the etherurm blockchain
 *
 * @dev LA_SPATIAL_UNIT (ISO 19152)
 *
*/

pragma solidity ^0.5.0;

import './geospatial/CSSurface.sol';

contract LAParcel is CSSurface {

    //
    // State variables
    //

    string public extAddressId;
    string public label;
    uint public area;

    //TODO add  parcelType :  Building, Agriculture, Industrial, ...

    //
    // Functions
    //

    /**
    * @notice constuctor
    * @dev initialize state variables
    *
    */
    constructor (bytes15 _dggsIndex, bytes32 _wkbHash, address _owner, uint _h3Resolution) public
    CSSurface(_dggsIndex, _wkbHash, _owner, _h3Resolution){
        //  geomteryType = CSGeometryLib.CSGeometryType.GM_CURVE;
    }

    /**
     * @notice set extAddressId state variable
     * @param _addrId the external address ID
     *
     */
     function setExtAddressId(string memory _addrId) public {
         extAddressId = _addrId;
     }

     /**
     * @notice set label state variable
     * @param _lbl the parcel label
     *
     */function setLabel(string memory _lbl) public {
         label = _lbl;
     }

     /**
     * @notice set area state variable
     * @param _area the area of the parcel
     *
     */function setArea(uint _area) public {
         area = _area;
     }
}
