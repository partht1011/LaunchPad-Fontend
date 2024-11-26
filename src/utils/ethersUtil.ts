// src/utils/ethers.js
import { ethers } from 'ethers';
import IDOFactoryABI from '../store/IDOFactory.json'; // Import your contract ABI
import IDOPoolABI from '../store/IDOPool.json'; // Import your contract ABI
import FeeTokenABI from '../store/FeeToken.json'; // Import your contract ABI
import { IDOFactoryAddress } from '../store/contract';

const connectWallet = async () => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            return accounts[0];
        }
    } else {
        alert('Please install MetaMask!');
    }
    return undefined
};

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = (await provider.getSigner()).address;
const getIDOFactory = async () => {
    const signer = await provider.getSigner();

    const IDOFactory = new ethers.Contract(IDOFactoryAddress, IDOFactoryABI, signer);
    return IDOFactory;
}
const getIDOPool = async (IDOPoolAddress: string) => {
    const signer = await provider.getSigner();

    const IDOPool = new ethers.Contract(IDOPoolAddress, IDOPoolABI, signer);
    return IDOPool;
}
const getBuyToken = async (buyTokenAddress: string) => {
    const signer = await provider.getSigner();

    const buyToken = new ethers.Contract(buyTokenAddress, FeeTokenABI, signer);
    return buyToken;
}

export { signer, getIDOFactory, getIDOPool, getBuyToken, connectWallet };
