import { Contract, ethers } from 'ethers';
import { IDOProps } from '../types/props';
import TokenLogo from './TokenLogo';
import { useEffect, useState } from 'react';
import { getIDOPool } from '../utils/ethersUtil';
import { formatEther } from '../utils/commonUtils';

const IDO = (ido: IDOProps) => {
  const [IDOPool, setIDOPool] = useState<Contract>();
  const [progress, setProgress] = useState(0);

  const startTime = new Date(Number(ido.timeInfo.startTime) * 1000);
  const endTime = new Date(Number(ido.timeInfo.endTime) * 1000);
  const claimTime = new Date(Number(ido.timeInfo.claimTime) * 1000);
  const now = new Date();

  let status = { label: 'Upcoming', color: 'text-pink bg-pink/10' };
  if (now >= claimTime) {
    status = { label: 'Claimable', color: 'text-yellow bg-yellow/10' };
  } else if (now >= endTime) {
    status = { label: 'Ended', color: 'text-grey-light bg-grey-light/10' };
  } else if (now >= startTime) {
    status = { label: 'Live', color: 'text-green bg-green/10' };
  }

  useEffect(() => {
    const getIDOPoolFunc = async () => {
      setIDOPool(await getIDOPool(ido.idoPool));
    };

    getIDOPoolFunc();
  }, []);

  useEffect(() => {
    if (IDOPool) {
      const getData = async () => {
        const totalBuyAmount = formatEther(await IDOPool.getTotalBuyAmount());
        setProgress((totalBuyAmount * 100) / formatEther(ido.saleInfo.softCap));
      };
      getData();
    }
  }, [IDOPool]);

  return (
    <a
      href={`#/ido/${ido.idoPool}`}
      className="flex flex-col justify-between w-[350px] h-[480px] px-6 py-6 rounded-2xl border border-grey-light/10 bg-grey-dark font-semibold transform 
                 cursor-pointer hover:drop-shadow-xl hover:-translate-y-2 hover:border-grey-light"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-3xl text-white font-semibold">
              {ido.saleTokenInfo.name}
            </p>
            <span
              className={`mt-2 px-2 py-[1px] rounded-full text-sm ${status.color} ${status.color}`}
            >
              {status.label}
            </span>
          </div>
          <TokenLogo src={ido.saleTokenInfo.metaData} />
        </div>
        <p className="mt-3 h-20 font-normal text-grey-normal overflow-clip">
          {ido.saleTokenInfo.description}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between mt-4">
          <p className="text-grey-light">Cap</p>
          <p className="text-grey-bright">
            {Number(ethers.formatEther(ido.saleInfo.hardCap.toString()))} USDT
          </p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-grey-light">Start Time</p>
          <p className="text-grey-bright">{startTime.toLocaleString()}</p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-grey-light">End Time</p>
          <p className="text-grey-bright">{endTime.toLocaleString()}</p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-grey-light">Claim Time</p>
          <p className="text-grey-bright">{claimTime.toLocaleString()}</p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-grey-light">Price</p>
          <p className="text-grey-bright">
            1 {ido.saleTokenInfo.symbol} ={' '}
            {ethers.formatEther(ido.saleInfo.listingPrice.toString())} USDT
          </p>
        </div>
        <p className="text-right text-grey-light mt-4">{progress}%</p>
        <div className="flex justify-end mt-2 rounded-full bg-grey-bright/10">
          <span
            style={{ width: `${progress}%` }}
            className="h-3 rounded-full bg-yellow"
          ></span>
        </div>
      </div>
    </a>
  );
};

export default IDO;
