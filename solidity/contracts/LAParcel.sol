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

    enum CadastralTypeCode { PARCEL, BUILDING }

    //
    // State variables
    //

    string internal label;        // Parcel label
    string internal extAddress;   // Parcel external real world address
    string internal landUseCode;  // may be : Residential, Commercial, Agricultural, Industrial, ...
    uint internal area;           // Cadastral area of the parcel
    CadastralTypeCode internal cadastralType;

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
     * @notice set extAddress state variable
     * @param _extAddr the external address
     * @param _label the label
     * @param _area the area in meter square
     * @param _landUseCode the land use code : Argricultural / Industrial /...
     */

     function setParcelValues(string calldata _label,
                              string calldata _extAddr,
                              string calldata _landUseCode,
                              uint _area,
                              CadastralTypeCode _cadastralType) external onlyAdmins(msg.sender) {
        // TODO Check inputs
         label = _label;
         extAddress = _extAddr;
         landUseCode = _landUseCode;
         area = _area;
         cadastralType = _cadastralType;
     }

    /**
     * @notice set extAddress state variable
     * @param _extAddr the external address
     */

     function setExtAddress(string calldata _extAddr) external onlyAdmins(msg.sender) {
         extAddress = _extAddr;
     }

     /**
     * @notice set label state variable
     * @param _label the parcel label
     */
     
     function setLabel(string calldata _label) external onlyAdmins(msg.sender) {
         label = _label;
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
     * @notice set setlandUseCode state variable
     * @param _landUseCode the Parcel Type of the parcel
     *
     */
     function setLandUseCode(string calldata _landUseCode) external onlyAdmins(msg.sender) {
         landUseCode = _landUseCode;
     }

     /**
      * @notice set setCadastralTypeCode state varibale
      * @param _cadastralType the parcel cadastral type
      *
      */
     function setCadastralTypeCode(CadastralTypeCode _cadastralType) external onlyAdmins(msg.sender) {
         cadastralType = _cadastralType;
     }

     /**
      * @dev returns all the state values of the Parcel
      */
     function fetchParcel() public view
     returns (bytes32, string memory, string memory, string memory, uint, CadastralTypeCode) {
         return (csc, label, extAddress, landUseCode, area, cadastralType);
     }

}
