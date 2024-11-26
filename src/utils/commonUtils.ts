import { ethers } from "ethers";

export const makeStructure = (flatData: any) => {
    const structuredData: any = {};

    for (const key in flatData) {
        const [main, prefix, property] = key.split('_');

        if (main && !prefix && !property) {
            structuredData[main] = flatData[key];
            continue;
        }
        // Initialize the object if it doesn't exist
        if (!structuredData[prefix]) {
            structuredData[prefix] = {};
        }

        // Assign the value to the appropriate property
        structuredData[prefix][property] = flatData[key];
    }
    return structuredData;
};


export const formatEther = (value: BigInt | undefined) => {
    if (value === undefined) return 0;
    return Number(ethers.formatEther(value.toString()));
};