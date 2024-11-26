export interface InputProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TabBarProps {
    activeTab: number;
    onTabChange: (activeTab: number) => void;
}

export interface IDOListProps {
    activeTab: number;
}

export interface TokenLogoProps {
    src: string | undefined;
}

export interface IPFSProps {
    onChange: (metaData: string) => void;
}

export interface SaleTokenInfoProps {
    symbol: string;
    name: string;
    initialSupply: BigInt;
    metaData: string;
    description: string;
}

export interface SaleInfoProps {
    tokenPrice: BigInt;
    softCap: BigInt;
    hardCap: BigInt;
    listingPrice: BigInt;
}

export interface TokenInfoProps {
    saleToken: string
    buyToken: string
}

export interface TimeInfoProps {
    startTime: Date;
    endTime: Date;
    claimTime: Date;
}

export interface IDOProps {
    idoPool: string;
    owner: string;
    buyTokenAddress: string;
    saleTokenInfo: SaleTokenInfoProps;
    saleInfo: SaleInfoProps;
    tokenInfo: TokenInfoProps,
    timeInfo: TimeInfoProps
}