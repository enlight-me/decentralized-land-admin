import React from 'react';

export default React.createContext({
    web3: null,
    accounts: null,
    contractParcelReg: null,
    features: [],
    parcels: [],
    claimParcel: (lat, lng, wkbHash, parcelArea, parcelAddressId, parcelLabel, parcelType) => {},
    updateFeatures: () => {},
    updateParcels: () => {},
            
    addFeatureDialogOpen: false,
    openAddFeatureDialog : () => {},
    closeAddFeatureDialog : () => {},

    drawerOpen: false,
    toggleDrawer: () => {}
});