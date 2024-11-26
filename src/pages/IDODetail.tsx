import { useQuery } from '@apollo/client';
import {
  GET_CLAIMABLE_POOLS,
  GET_CONTRIBUTES,
  GET_POOL_BY_ADDRESS,
  GET_REFUNDS,
} from '../store/queries';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contract, ethers } from 'ethers';
import { formatEther, makeStructure } from '../utils/commonUtils';
import { getBuyToken, getIDOPool, signer } from '../utils/ethersUtil';
import { IDOProps } from '../types/props';

import TokenLogo from '../components/TokenLogo';
import { error } from 'console';

const IDODetail = () => {
  const { poolAddress } = useParams();

  const {
    loading: loadingPoolInfo,
    error: errorPoolInfo,
    data: dataPoolInfo,
    refetch: refetchPoolInfo,
  } = useQuery(GET_POOL_BY_ADDRESS, {
    variables: { poolAddress },
  });

  const {
    loading: loadingContributes,
    error: errorContributes,
    data: dataContributes,
    refetch: refetchContributes,
  } = useQuery(GET_CONTRIBUTES, {
    variables: { poolAddress },
  });

  const {
    loading: loadingRefunds,
    error: errorRefunds,
    data: dataRefunds,
    refetch: refetchRefunds,
  } = useQuery(GET_REFUNDS, {
    variables: { poolAddress },
  });

  const loading = loadingPoolInfo || loadingContributes || loadingRefunds;
  const error = errorPoolInfo || errorContributes || errorRefunds;

  const [ido, setIDO] = useState<IDOProps>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [claimTime, setClaimTime] = useState<Date>();
  const [status, setStatus] = useState<any>({
    label: 'Upcoming',
    color: 'text-pink bg-pink/10',
  });

  const [IDOPool, setIDOPool] = useState<Contract>();
  const [BuyToken, setBuyToken] = useState<Contract>();
  const [buyAmount, setBuyAmount] = useState('');
  const [buyTokenSymbol, setBuyTokenSymbol] = useState<string>();
  const [buyStatus, setBuyStatus] = useState<boolean>(true);

  const [buyAble, setBuyAble] = useState(true);
  const buyBtnEffect = buyAble
    ? 'border-pink text-pink hover:bg-pink hover:text-grey-dark'
    : 'border-grey-bright/10 text-grey-bright/10';
  const [refundAble, setRefundAble] = useState(true);
  const refundBtnEffect = refundAble
    ? 'border-green text-green hover:bg-green hover:text-grey-dark'
    : 'border-grey-bright/10 text-grey-bright/10';
  const [claimAble, setClaimAble] = useState(true);
  const claimBtnEffect = claimAble
    ? 'border-yellow text-yellow hover:bg-yellow hover:text-grey-dark'
    : 'border-grey-bright/10 text-grey-bright/10';
  const [withdrawAble, setWithdrawAble] = useState(true);
  const withdrawBtnEffect = withdrawAble
    ? 'border-yellow text-yellow hover:bg-yellow hover:text-grey-dark'
    : 'border-grey-bright/10 text-grey-bright/10';

  const [totalContributes, setTotalContributes] = useState(0);
  const [userContributes, setUserContributes] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (dataPoolInfo) {
      setIDO(makeStructure(dataPoolInfo.idopoolCreateds[0]));
    }
  }, [dataPoolInfo]);

  useEffect(() => {
    if (dataContributes) {
    }
  }, [dataContributes]);

  useEffect(() => {
    if (dataRefunds) {
    }
  }, [dataRefunds]);

  useEffect(() => {
    if (ido) {
      const getIDOPoolFunc = async () => {
        if (poolAddress) {
          setIDOPool(await getIDOPool(poolAddress));
        }
      };

      const getBuyTokenFunc = async () => {
        setBuyToken(await getBuyToken(ido.buyTokenAddress));
      };

      getIDOPoolFunc();
      getBuyTokenFunc();

      setWithdrawAble(ido?.owner.toLowerCase() === signer.toLowerCase());

      const start = new Date(Number(ido.timeInfo.startTime) * 1000);
      const end = new Date(Number(ido.timeInfo.endTime) * 1000);
      const claim = new Date(Number(ido.timeInfo.claimTime) * 1000);

      setStartTime(start);
      setEndTime(end);
      setClaimTime(claim);

      const now = new Date();
      if (now >= claim) {
        setStatus({ label: 'Claimable', color: 'text-yellow bg-yellow/10' });
        setBuyAble(false);
      } else if (now >= end) {
        setStatus({
          label: 'Ended',
          color: 'text-grey-light bg-grey-light/10',
        });
        setBuyAble(false);
        setClaimAble(false);
      } else if (now >= start) {
        setStatus({ label: 'Live', color: 'text-green bg-green/10' });
        setRefundAble(false);
        setClaimAble(false);
        setWithdrawAble(false);
      } else {
        setBuyAble(false);
        setRefundAble(false);
        setClaimAble(false);
        setWithdrawAble(false);
      }
    }
  }, [ido]);

  useEffect(() => {
    if (BuyToken) {
      const getBuyTokenSymbol = async () => {
        setBuyTokenSymbol(await BuyToken.symbol());
      };

      getBuyTokenSymbol();
    }
  }, [BuyToken]);

  const getContributeData = async () => {
    if (IDOPool) {
      const totalBuyAmount = formatEther(await IDOPool.getTotalBuyAmount());
      const userBuyAmount = formatEther(
        (await IDOPool.getBuyAmountByUser()).buyTokenAmount
      );
      setTotalContributes(totalBuyAmount);
      setUserContributes(userBuyAmount);
      setProgress((totalBuyAmount * 100) / formatEther(ido?.saleInfo.softCap));

      if (status.label === 'Claimable' && !userBuyAmount) {
        setClaimAble(false);
      }
      if (!userBuyAmount) {
        setRefundAble(false);
        setWithdrawAble(false);
      }
    }
  };
  useEffect(() => {
    getContributeData();
  }, [IDOPool]);

  useEffect(() => {
    if (buyAmount) {
      const validateBuyAmount = async () => {
        const allowance = await BuyToken?.allowance(signer, ido?.idoPool);
        if (allowance < ethers.parseEther(buyAmount)) {
          setBuyStatus(false);
        } else {
          setBuyStatus(true);
        }
      };
      validateBuyAmount();
    } else {
      setBuyStatus(true);
    }
  }, [buyAmount]);

  if (loading || error) {
    return (
      <main className="flex flex-col flex-grow items-center mt-[100px] px-[200px]">
        {loading && <p className="text-white text-3xl">Loading...</p>}
        {error && <p className="text-pink text-3xl">Error : {error.message}</p>}
      </main>
    );
  }

  const onBuyAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyAmount(e.target.value);
  };

  const onBuyClick = async () => {
    setBuyAble(false);

    try {
      if (!buyStatus) {
        const tx = await BuyToken?.approve(
          ido?.idoPool,
          ethers.parseEther(buyAmount)
        );
        await tx.wait();
        setBuyStatus(true);
      } else {
        const tx = await IDOPool?.contribute(ethers.parseEther(buyAmount));
        await tx.wait();
        getContributeData();
        setBuyAmount('');
        refetchContributes();
      }
    } catch (error: any) {
      alert(error.message);
    }
    setBuyAble(true);
  };

  const onRefundClick = async () => {
    setRefundAble(false);
    try {
      const tx = await IDOPool?.refund();
      await tx.wait();
      getContributeData();
      refetchRefunds();
    } catch (error: any) {
      alert(error.message);
    }
    setRefundAble(true);
  };

  const onClaimClick = async () => {
    setClaimAble(false);
    try {
      const tx = await IDOPool?.claim();
      await tx.wait();
      getContributeData();
    } catch (error: any) {
      alert(error.message);
    }
    setClaimAble(true);
  };

  const onWithdrawClick = async () => {
    setWithdrawAble(false);
    try {
      const tx = await IDOPool?.withdraw();
      await tx.wait();
    } catch (error: any) {
      alert(error.message);
    }
    setWithdrawAble(true);
  };
  return (
    <main className="flex flex-grow items-start mt-[100px] px-[200px] gap-4">
      <div className="flex flex-col w-[440px] p-6 rounded-2xl border border-grey-light/10 bg-grey-dark font-semibold">
        <div className="flex flex-col text-lg">
          <div className="flex items-center">
            <TokenLogo src={ido?.saleTokenInfo.metaData} />
            <div className="flex flex-col flex-1 items-center ml-5">
              <p className="text-3xl text-white font-semibold">
                {ido?.saleTokenInfo.name}
              </p>
              <span
                className={`mt-2 px-8 py-[1px] rounded-full text-sm ${status.color} ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          </div>
          <p className="text-pink text-2xl text-center mt-6">
            1 {buyTokenSymbol} = {1 / formatEther(ido?.saleInfo.listingPrice)}{' '}
            {ido?.saleTokenInfo.symbol}
          </p>
          <p className="text-yellow text-xl text-center mt-2">
            1 {ido?.saleTokenInfo.symbol} ={' '}
            {formatEther(ido?.saleInfo.listingPrice)} {buyTokenSymbol}
          </p>
          <div className="flex justify-between mt-6 ">
            <p className="text-grey-light"> Soft Cap</p>
            <p className="text-grey-bright">
              {formatEther(ido?.saleInfo.softCap)} {buyTokenSymbol}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-grey-light"> Hard Cap</p>
            <p className="text-grey-bright">
              {formatEther(ido?.saleInfo.hardCap)} {buyTokenSymbol}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-grey-light"> Initial Supply</p>
            <p className="text-grey-bright">
              {formatEther(ido?.saleTokenInfo.initialSupply)}{' '}
              {ido?.saleTokenInfo.symbol}
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
      </div>
      <div className="flex flex-col justify-between w-full h-full px-6 py-6 rounded-2xl border border-grey-light/10 bg-grey-dark text-lg">
        <div className="flex flex-col">
          <div className="flex items-center">
            <TokenLogo src={ido?.saleTokenInfo.metaData} />
            <div className="flex flex-col items-start ml-5">
              <p className="text-4xl text-white font-semibold">
                {ido?.saleTokenInfo.symbol}
                <span className="text-green">/</span>
                {buyTokenSymbol}{' '}
                <span className="text-grey-bright">IDO Platform</span>
              </p>
            </div>
          </div>
          <p className="mt-3 h-20 font-normal text-grey-normal overflow-clip">
            {ido?.saleTokenInfo.description}
          </p>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex flex-col w-2/3  p-4 rounded-2xl border border-grey-light/10 bg-grey-dark drop-shadow-md">
            <div className="flex justify-center">
              <p className="text-2xl text-green font-bold">Pool Information</p>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-grey-light">Pool Address</p>
              <p className="text-grey-bright">{ido?.idoPool}</p>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-grey-light">Pool Owner</p>
              <p className="text-grey-bright">{ido?.owner}</p>
            </div>
          </div>
          <div className="flex flex-col w-1/3  p-4 rounded-2xl border border-grey-light/10 bg-grey-dark drop-shadow-md">
            <div className="flex justify-center">
              <p className="text-2xl text-grey-bright font-bold">Only Owner</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <p className="text-grey-light">Withdraw amount</p>
              <div className="flex gap-2 items-end">
                <p className="text-yellow text-3xl">{totalContributes}</p>
                <p className="text-grey-light">{buyTokenSymbol}</p>
              </div>
            </div>
            <div className="flex justify-between mt-5">
              <button
                className={`flex-1 px-6 py-2 rounded-xl border font-semibold text-[18px] outline-none
                        ${withdrawBtnEffect}`}
                onClick={onWithdrawClick}
                disabled={!withdrawAble}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-end mt-4">
          <div className="flex flex-col w-1/3 p-4 rounded-2xl border border-grey-light/10 bg-grey-dark drop-shadow-md">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={buyAmount}
                onChange={onBuyAmountChange}
                placeholder="Enter amount to buy"
                disabled={!buyAble}
                className="flex-1 p-2 rounded-lg bg-dark border border-grey-bright/10 text-right text-white placeholder-white/10 outline-none focus:border-grey-bright/50"
              />
              <p className="text-grey-bright font-semibold">{buyTokenSymbol}</p>
            </div>
            <div className="flex justify-between mt-4 items-end">
              <p className="text-grey-light">You will receive</p>
              <div className="flex gap-2 items-end">
                <p className="text-pink text-3xl">
                  {Number(buyAmount) / formatEther(ido?.saleInfo.listingPrice)}{' '}
                </p>
                <p className="text-grey-light">{ido?.saleTokenInfo.symbol}</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-grey-light">Start Time</p>
              <p className="text-grey-bright">{startTime?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between mt-5">
              <button
                className={`flex-1 px-6 py-2 rounded-xl border font-semibold text-[18px] outline-none
                        ${buyBtnEffect}`}
                onClick={onBuyClick}
                disabled={!buyAble}
              >
                {buyStatus ? 'Contribute' : 'Approve'}
              </button>
            </div>
          </div>
          <div className="flex flex-col w-1/3 h-full p-4 rounded-2xl border border-grey-light/10 bg-grey-dark drop-shadow-md">
            <div className="flex justify-between items-end">
              <p className="text-grey-light">Total contributed</p>
              <div className="flex gap-2 items-end">
                <p className="text-green text-3xl">{totalContributes}</p>
                <p className="text-grey-light">{buyTokenSymbol}</p>
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <p className="text-grey-light">You contributed</p>
              <div className="flex gap-2 items-end">
                <p className="text-green text-3xl">{userContributes}</p>
                <p className="text-grey-light">{buyTokenSymbol}</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-grey-light">End Time</p>
              <p className="text-grey-bright">{endTime?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between mt-5">
              <button
                className={`flex-1 px-6 py-2 rounded-xl border font-semibold text-[18px] outline-none
                        ${refundBtnEffect}`}
                onClick={onRefundClick}
                disabled={!refundAble}
              >
                Refund
              </button>
            </div>
          </div>
          <div className="flex flex-col w-1/3 h-full p-4 rounded-2xl border border-grey-light/10 bg-grey-dark drop-shadow-md">
            <div className="flex justify-between items-end">
              <p className="text-grey-light">To claim</p>
              <div className="flex gap-2 items-end">
                <p className="text-yellow text-3xl">
                  {userContributes / formatEther(ido?.saleInfo.listingPrice)}{' '}
                </p>
                <p className="text-grey-light">{ido?.saleTokenInfo.symbol}</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-grey-light">Claim Time</p>
              <p className="text-grey-bright">{claimTime?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between mt-5">
              <button
                className={`flex-1 px-6 py-2 rounded-xl border font-semibold text-[18px] outline-none
                        ${claimBtnEffect}`}
                onClick={onClaimClick}
                disabled={!claimAble}
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IDODetail;
