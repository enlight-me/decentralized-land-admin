import React, { useState, useEffect } from 'react';

import getWeb3 from "../utils/getWeb3";
import DelaContext from './dela-context';

import LAParcelRegistry from "../contracts/LAParcelRegistry.json";
import LAParcel from "../contracts/LAParcel.json";


const GlobalState = (props) => {
    /**
     * @dev State variables
     */
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contractParcelReg, setContractParcelReg] = useState(null);
    const [features, setFeatures] = useState([]);
    const [parcels, setParcels] = useState([]);

    const [addFeatureDialogOpen, setAddFeatureDialogOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    /**
     * UI events handlers
     */

    const openAddFeatureDialog = () => {
        setAddFeatureDialogOpen(true);
    };

    const closeAddFeatureDialog = () => {
        setAddFeatureDialogOpen(false);
    };

    const toggleDrawer = (evt) => {
        setDrawerOpen(!drawerOpen);
    };

    /**
     * @dev React Component useEffect Hook
     * @notice with empty array as parameter effect will run just once when the component mounts 
     */

    useEffect(() => {
        initWeb3()
            .then((res) => {
                const [_web3, _accounts, _contract] = res;
                setWeb3(_web3);
                setAccounts(_accounts);
                setContractParcelReg(_contract);
            })
            .catch(e => {
                console.log(e);
            });
    }, []);


    /**
     * @dev init all Ethereum web3 useful varibales 
     * @notice web3, accounts, contracts instances,...
     */

    const initWeb3 = async () => {
        var web3 = null;
        var accounts = null;
        var contractParcelReg = null;

        try {
            // Get network provider and web3 instance.
            web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();

            const deployedParcelReg = LAParcelRegistry.networks[networkId];
            contractParcelReg = new web3.eth.Contract(
                LAParcelRegistry.abi,
                deployedParcelReg && deployedParcelReg.address,
            );
            contractParcelReg.events.LogParcelClaimed((err, events) => parcelClaimed(err, events)).on('error', console.error);

            return [web3, accounts, contractParcelReg];

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    /**
     * @dev Handle Smart contract log events 
     * @param {*} err erroe
     * @param {*} events the events
     */

    const parcelClaimed = (err, events) => {
        updateFeatures();
    }

    /**
     * @notice updateFeatures Button on the AppBar
     * @todo replace it with a button directly on the map
     *        the mainmap should use the features state variable of this Component 'App'
     *        like the DrawerList
     *        This will allow to avoid using OnRef (this.mainMap.)
     */

    const updateFeatures = () => {
        fetch('http://localhost:4000/collections/features')
            .then(res => {
                return res.json();
            }).then(data => {
                setFeatures(data);
                updateParcels(data);
            });

    };

    /**
     * @dev update Parcles state varibale
     * @param {*} data 
     */
    const updateParcels = (data) => {

        data.map(async (value) => {
            const featureAddress = await contractParcelReg.methods.getFeature(value.properties.csc).call();
            const parcel = new web3.eth.Contract(LAParcel.abi, featureAddress);
            const parcelValues = await parcel.methods.fetchParcel().call();
            console.log(parcelValues);
            const parcelAttributes = {
                'csc': parcelValues[0], 'address': parcelValues[1],
                'label': parcelValues[2], 'area': parcelValues[3], 'parcelType': parcelValues[4]
            };
            setParcels(...parcels, parcelAttributes);
        });

    };

    /**
     * Render function
     */
    return (
        <DelaContext.Provider value={{
            web3,
            accounts,
            contractParcelReg,
            features,
            parcels,
            updateFeatures,
            updateParcels,

            addFeatureDialogOpen,
            openAddFeatureDialog,
            closeAddFeatureDialog,

            drawerOpen,
            toggleDrawer
        }}>
            {props.children}

        </DelaContext.Provider>
    );
}

export default GlobalState;