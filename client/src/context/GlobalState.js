import React, { useState, useEffect } from 'react';
import Web3 from 'web3'
import { geoToH3, h3ToGeo } from 'h3-js';

import getWeb3 from "../utils/getWeb3";
import DelaContext from './dela-context';

import LAParcelRegistry from "../contracts/LAParcelRegistry.json";
import LAParcel from "../contracts/LAParcel.json";


const GlobalState = (props) => {
    var claimEventBlocks = new Set();
    var revokeEventBlocks = new Set();
    /**
     * @dev State variables
     */
    const [web3, setWeb3] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [contractParcelReg, setContractParcelReg] = useState({});
    const [parcels, setParcels] = useState([]);
    const [updateMode, setUpdateMode] = useState(false);

    const [manageParcelDialogOpen, openManageParcelDialog] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [parcelToUpdate, setParcelToUpdate] = useState({});

    /**
     * UI events handlers
     */

    const closeManageParcelDialog = () => {
        openManageParcelDialog(false);
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
                // Registring events handlers
                _contract.events.LogParcelClaimed({ fromBlock: 0 }, (err, events) => {
                    eventParcelClaimed(err, events, _web3, _accounts, _contract);
                }).on('error', console.error);

                _contract.events.LogFeatureRemoved({ fromBlock: 0 }, (err, events) => {
                    eventParcelRevoked(err, events, _web3, _accounts, _contract);
                }).on('error', console.error);
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
            setWeb3(web3);

            // Use web3 to get the user's accounts.
            accounts = await web3.eth.getAccounts();
            setAccounts(accounts);

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();

            const deployedParcelReg = LAParcelRegistry.networks[networkId];
            contractParcelReg = new web3.eth.Contract(
                LAParcelRegistry.abi,
                deployedParcelReg && deployedParcelReg.address,
            );
            setContractParcelReg(contractParcelReg);

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
     * @dev send a claim parcel transaction and handle results
     */

    const claimParcel = async (lat, lng, wkbHash, parcelArea,
        parcelExtAddress, parcelLabel, parcelLandUseCode) => {

        const h3Index = geoToH3(lat, lng, 15);  // Resolution (15) should be read from the registry 
        const h3IndexHex = web3.utils.utf8ToHex(h3Index);
        const _wkbHash = web3.utils.asciiToHex(wkbHash);
        const area = Number(parcelArea);

        try {
            const result = await contractParcelReg.methods.claimParcel(h3IndexHex, _wkbHash,
                parcelExtAddress, parcelLabel,
                area, parcelLandUseCode)
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
     * @notice Handle Smart contract log events : claimParcel
     */

    const eventParcelClaimed = async (err, events, web3, accounts, contract) => {

        const res = events.returnValues;

        // Workaround to avoid duplicated event firing 
        let blockNumber = events.blockNumber;
        if (claimEventBlocks.has(blockNumber)) return;
        claimEventBlocks.add(blockNumber);

        // check if the parcel haven't been removed before adding it
        const featureExist = await contract.methods.dggsIndexExist(res.dggsIndex).call();
        if (!featureExist) return;

        const parcel = await fetchParcel(res.csc, web3, contract); // get the updated values for the parcel

        const dggsIndex = web3.utils.hexToUtf8(res.dggsIndex); // Be aware of change in dggsIndex
        const latlng = h3ToGeo(dggsIndex);

        const parcelDetails = {
            csc: parcel.csc, latlng, addr: parcel.addr, lbl: parcel.lbl,
            area: parcel.area, parcelLandUseCode: parcel.parcelLandUseCode, owner: parcel.owner
        };

        setParcels(parcels => {
            const list = [...parcels, parcelDetails];
            return list;
        });
    }

    /**
     * @dev revokeParcel
     */
    const revokeParcel = async (parcel) => {

        try {
            const result = await contractParcelReg.methods.removeFeature(parcel.csc).send({ from: accounts[0] });
            return result.events.LogFeatureRemoved.transactionHash;
        }
        catch (error) {
            console.error(error);
        }

    }

    /**
     * @notice Handle Smart contract log events : LogFeatureRemoved
     */

    const eventParcelRevoked = (err, events, _web3, _accounts, _contract) => {

        // Workaround to avoid duplicated event firing 
        let blockNumber = events.blockNumber;
        if (revokeEventBlocks.has(blockNumber)) return;
        revokeEventBlocks.add(blockNumber);

        const csc = events.returnValues.csc;
        setParcels(parcels => {
            const list = parcels.filter((parcel) => parcel.csc !== csc);
            return list;
        });
    }

    /**
     * @dev updateParcel
     * @TODO  implement updates
     */
    const updateParcel = async (parcelArea, parcelExtAddress, parcelLabel, parcelLandUseCode) => {

        try {
            const featureAddress = await contractParcelReg.methods.getFeature(parcelToUpdate.csc).call();
            const parcel = new web3.eth.Contract(LAParcel.abi, featureAddress);

            var res = null;
            if (parcelExtAddress !== parcelToUpdate.addr)
             res = await parcel.methods.setExtAddress(parcelExtAddress).send({ from: accounts[0] });; 

            if (parcelLabel !== parcelToUpdate.lbl)
             res = await parcel.methods.setLabel(parcelLabel).send({ from: accounts[0] });; 

            if (parcelArea !== parcelToUpdate.area)
             res = await parcel.methods.setArea(Number(parcelArea)).send({ from: accounts[0] });; 

            if (parcelLandUseCode !== parcelToUpdate.parcelLandUseCode)
             res = await parcel.methods.setLandUseCode(parcelLandUseCode).send({ from: accounts[0] });; 

            setParcels(parcels => {
                const list = parcels.filter((item) => item.csc !== parcelToUpdate.csc);
                
                const parcelDetails = {
                    csc: parcelToUpdate.csc, latlng : parcelToUpdate.latlng, owner: parcelToUpdate.owner,
                    addr: parcelExtAddress, lbl: parcelLabel,
                    area: parcelArea, parcelLandUseCode
                };

                list.push(parcelDetails);

                return list;
            });
        
            if (res) return res.transactionHash;
            else return "";
        }
        catch (error) {
            console.error(error);
        }

    }

    /**
     * @dev returns the attributes of the parcel 
     */

    const fetchParcel = async (csc, web3, contractParcelReg) => {

        const featureAddress = await contractParcelReg.methods.getFeature(csc).call();
        const parcel = new web3.eth.Contract(LAParcel.abi, featureAddress);
        const res = await parcel.methods.fetchParcel().call();
        const owner = await parcel.methods.owner().call();
        
        return { csc: res[0], lbl: res[1], addr : res[2],
                 parcelLandUseCode: res[3], area: res[4], owner: owner };
    };

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

            updateMode,
            setUpdateMode,
            parcelToUpdate,
            setParcelToUpdate,
            manageParcelDialogOpen,
            openManageParcelDialog,
            closeManageParcelDialog,

            drawerOpen,
            toggleDrawer
        }}>
            {props.children}

        </DelaContext.Provider>
    );
}

export default GlobalState;