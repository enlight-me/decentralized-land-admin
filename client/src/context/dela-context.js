import React from 'react';

export default React.createContext({
    web3: null,
    accounts: null,
    contractParcelReg: null,
    features: [],
    parcels: [],
    updateFeatures: () => {},
    updateParcels: () => {}
});