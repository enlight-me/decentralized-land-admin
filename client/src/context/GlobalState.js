import React, { useState, useEffect } from 'react';
import Web3 from 'web3'
import { geoToH3, h3ToGeo } from 'h3-js';

import getWeb3 from "../utils/getWeb3";
import DelaContext from './dela-context';

import LAParcelRegistry from "../contracts/LAParcelRegistry.json";
import LAParcel from "../contracts/LAParcel.json";


const GlobalState = (props) => {
    /**
     * @dev State variables
     */
    const [web3, setWeb3] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [contractParcelReg, setContractParcelReg] = useState({});
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
        var web3 = {};
        var accounts = [];
        var contractParcelReg = {};

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
            contractParcelReg.events.LogParcelClaimed({ fromBlock: 0}, (err, events) => {
                eventParcelClaimed(err, events);
            }).on('error', console.error);
            
            contractParcelReg.events.LogFeatureRemoved({ fromBlock: 0}, (err, events) => {
                eventParcelRevoked(err, events);
            }).on('error', console.error);
 
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
     * @notice Handle Smart contract log events : claimParcel
     */

    const eventParcelClaimed = (err, events) => {
        
        const res = events.returnValues;
        
        // workaround to avoid web3=null error ????
        const w3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io'));
        const dggsIndex = w3.utils.hexToUtf8(res.dggsIndex);
        const latlng = h3ToGeo(dggsIndex);

        const parcelDetails = {csc: res.csc, latlng, addr: res.addr, lbl: res.lbl, 
                               area: res.area, parcelType: res.parcelType, owner: res.owner}

        parcels.push(parcelDetails);
        setParcels(parcels);        
        }

    
    /**
     * @notice Handle Smart contract log events : LogFeatureRemoved
     */ 
     
    const eventParcelRevoked = (err, events) => {

        const csc = events.returnValues.csc;

        console.log(csc);

        for (var i = 0; i < parcels.length; i++) {
            if (parcels[i].csc === csc) {
                parcels.splice(i, 1);
            }
        }


    }

    /**
   * @dev send a claim parcel transaction and handle results
   */

    const claimParcel = async (lat, lng, wkbHash, parcelArea,
                                 parcelAddressId, parcelLabel, parcelType) => {
    
        const h3Index = geoToH3(lat, lng, 15);  // Resolution (15) should be read from the registry 
        const h3IndexHex = web3.utils.utf8ToHex(h3Index);
        const _wkbHash = web3.utils.asciiToHex(wkbHash);
        const area = Number(parcelArea);

        try {
            const result = await contractParcelReg.methods.claimParcel(h3IndexHex, _wkbHash,
                                                                       parcelAddressId, parcelLabel, 
                                                                       area, parcelType)
                                                                       .send({ from: accounts[0] });

            return result.events.LogParcelClaimed.transactionHash;
        }
        catch (error) {
            if (error.code === 4001) {
                // handle the "error" as a rejection
                alert(`Transaction cancelled by the user.`);
            } else {
                // Catch any errors for any of the above operations.
                alert(`Failed to send Claim transaction for unknown reason, please check the console log.`,
                );
            }
            console.error(error);
        }
    };

    /**
     * @dev revokeParcel
     */
    const revokeParcel = async (parcel) => {
        
        console.log('revoke', parcel.csc);

        try {
            const result = await contractParcelReg.methods.removeFeature(parcel.csc).send({ from: accounts[0] });
            return result.events.LogFeatureRemoved.transactionHash;
        }
        catch (error) {
            console.error(error);
        }

    }

    /**
     * @dev updateParcel
     */
    const updateParcel= (parcel) => {
        
        console.log('update');

    }

    /**
     * @notice updateFeatures Button on the AppBar
     * @todo replace it with a button directly on the map
     *        the mainmap should use the features state variable of this Component 'App'
     *        like the DrawerList
     *        This will allow to avoid using OnRef (this.mainMap.)
     */

    // const updateFeatures = () => {
    //     fetch('http://localhost:4000/collections/features')
    //         .then(res => {
    //             return res.json();
    //         }).then(data => {
    //             setFeatures(data);
    //             // updateParcels(data);
    //         });
    // };

    /**
     * @dev update Parcles state varibale
     * @param {*} data 
     */
    // const updateParcels = (data) => {

    //     data.map(async (value) => {
    //         const featureAddress = await contractParcelReg.methods.getFeature(value.properties.csc).call();
    //         const parcel = new web3.eth.Contract(LAParcel.abi, featureAddress);
    //         const parcelValues = await parcel.methods.fetchParcel().call();
    //         console.log(parcelValues);
    //         const parcelAttributes = {
    //             'csc': parcelValues[0], 'address': parcelValues[1],
    //             'label': parcelValues[2], 'area': parcelValues[3], 'parcelType': parcelValues[4]
    //         };
    //         setParcels(...parcels, parcelAttributes);
    //     });
    // };

    /**
     * Render function
     */
    return (
        <DelaContext.Provider value={{
            web3,
            accounts,
            contractParcelReg,

            parcels,
            claimParcel,
            updateParcel,
            revokeParcel,

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