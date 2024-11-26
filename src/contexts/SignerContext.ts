// // SignerContext.tsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// interface SignerContextType {
//     signer: ethers.Signer | null;
//     address: string | null;
//     connect: () => Promise<void>;
// }

// const SignerContext = createContext<SignerContextType | undefined>(undefined);

// export const useSigner = () => {
//     const context = useContext(SignerContext);
//     if (!context) {
//         throw new Error('useSigner must be used within a SignerProvider');
//     }
//     return context;
// };

// export const SignerProvider = (children : React.ReactNode) => {
//     const [signer, setSigner] = useState<ethers.Signer | null>(null);
//     const [address, setAddress] = useState<string | null>(null);

//     const connect = async () => {
//         if (typeof window.ethereum !== 'undefined') {
//             const provider = new ethers.BrowserProvider(window.ethereum);
//             const accounts = await provider.send('eth_requestAccounts', []);
//             const signer = provider.getSigner();
//             setSigner(await signer);
//             setAddress(accounts[0]);
//         } else {
//             console.error('MetaMask is not installed');
//         }
//     };

//     useEffect(() => {
//         if (window.ethereum) {
//             // Handle account changes
//             window.ethereum.on('accountsChanged', (accounts: string[]) => {
//                 setAddress(accounts[0]);
//             });
//         }
//     }, []);

//     return (
//         <SignerContext.Provider value= {{ signer, address, connect }}>
//             { children }
//         </SignerContext.Provider>
//     );
// };
