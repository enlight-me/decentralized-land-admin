import React from 'react';

export default React.createContext({
    web3: {},
    accounts: [],
    contractParcelReg: {},

    parcels: [],
    claimParcel: (lat, lng, wkbHash, parcelArea, parcelAddressId, parcelLabel, parcelType) => {},
    updateParcel: (parcelArea, parcelAddressId, parcelLabel, parcelType) => {},
    revokeParcel: (parcel) => {},

    updateMode : false,
    setUpdateMode : () => {},
    parcelToUpdate: {} ,
    setParcelToUpdate: () => {},
    manageParcelDialogOpen: false,
    openManageParcelDialog : () => {},
    closeManageParcelDialog : () => {},

    drawerOpen: false,
    toggleDrawer: () => {}
});