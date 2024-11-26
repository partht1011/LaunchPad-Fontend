import { useReadContract } from "wagmi";
import IDOFactoryABI from '../store/IDOFactory.json'; // Import your contract ABI
import { IDOFactoryAddress } from '../store/contract';

export function useContractValue() {
    const { data, isLoading, error } = useReadContract({
        address: IDOFactoryAddress,
        abi: IDOFactoryABI,
        functionName: "getBlacklistAddresses",
    });

    return { data, isLoading, error };
}
