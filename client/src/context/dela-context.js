import React from 'react';

export default React.createContext({
    web3: {},
    accounts: [],
    contractParcelReg: {},

    mainMapReference: {},
    setMainMapReference: () => { },

    parcels: [],
    claimParcel: (lat, lng, wkbHash, parcelArea, parcelExtAddress, parcelLabel, parcelLandUseCode, cadastralType) => { },
    updateParcel: (parcelArea, parcelExtAddress, parcelLabel, parcelLandUseCode, parcelCadastralType) => { },
    revokeParcel: (parcel) => { },

    updateMode: false,
    setUpdateMode: () => { },
    parcelToUpdate: {},
    setParcelToUpdate: () => { },
    manageParcelDialogOpen: false,
    openManageParcelDialog: () => { },
    closeManageParcelDialog: () => { },

    drawerOpen: false,
    toggleDrawer: () => { }
});