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

    string internal extAddressId; // Parcel external real world address ID
    string internal label;        // Parcel label
    uint internal area;           // Cadastral area of the parcel
    string internal parcelType;   // may be : Building, Agriculture, Industrial, ...

    //
    // Functions
    //

    /**
    * @notice constuctor
    * @dev initialize state variables
    */

    constructor (bytes15 _dggsIndex, bytes32 _wkbHash, address _owner, uint _h3Resolution) public
    CSSurface(_dggsIndex, _wkbHash, _owner, _h3Resolution){
    }

    /**
     * @notice set extAddressId state variable
     * @param _addrId the external address ID
     */

     function setExtAddressId(string calldata _addrId) external onlyAdmins(msg.sender) {
         extAddressId = _addrId;
     }

     /**
     * @notice set label state variable
     * @param _lbl the parcel label
     */
     
     function setLabel(string calldata _lbl) external onlyAdmins(msg.sender) {
         label = _lbl;
     }

     /**
     * @notice set area state variable
     * @param _area the area of the parcel
     *
     */
     function setArea(uint _area) external onlyAdmins(msg.sender) {
         area = _area;
     }

    /**
     * @notice set setParcelType state variable
     * @param _parcelType the Parcel Type of the parcel
     *
     */
     function setParcelType(string calldata _parcelType) external onlyAdmins(msg.sender) {
         parcelType = _parcelType;
     }

     /**
      * @dev returns all the state values of the Parcel
      */
     function fetchParcel() public view
     returns (bytes32, string memory, string memory, uint, string memory ) {
         return (csc, extAddressId, label, area, parcelType);

     }


}
