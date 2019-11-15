import React from 'react';

export default React.createContext({
    web3: {},
    accounts: [],
    contractParcelReg: {},

    parcels: [],
    claimParcel: (lat, lng, wkbHash, parcelArea, parcelAddressId, parcelLabel, parcelType) => {},
    updateParcel: (parcel) => {},
    revokeParcel: (parcel) => {},
            
    addFeatureDialogOpen: false,
    openAddFeatureDialog : () => {},
    closeAddFeatureDialog : () => {},

    drawerOpen: false,
    toggleDrawer: () => {}
});