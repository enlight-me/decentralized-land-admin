import React from 'react';

export default React.createContext({
    web3: {},
    accounts: [],
    contractParcelReg: {},

    parcels: [],
    claimParcel: (lat, lng, wkbHash, parcelArea, parcelAddress, parcelLabel, landUseCode) => {},
    updateParcel: (parcelArea, parcelAddress, parcelLabel, landUseCode) => {},
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