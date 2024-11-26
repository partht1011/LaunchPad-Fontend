import { useEffect, useState } from 'react';
import { connectWallet } from '../utils/ethersUtil';

function Header() {
  const [connectedAddress, setConnectedAddress] = useState('');

  useEffect(() => {
    onConnectCliked();
  }, []);

  async function onConnectCliked() {
    if (window.ethereum) {
      const address = await connectWallet();
      setConnectedAddress(address);
    } else {
      alert('Please install MetaMask!');
    }
  }

  return (
    <header className="order-0 fixed left-0 top-0 w-full h-[80px] flex items-center justify-between px-[200px] bg-primary drop-shadow-xl">
      <h1 className="text-3xl text-white font-bold">
        Launch<span className="text-yellow">P</span>ad
      </h1>
      <nav>
        <button
          className="px-6 py-2 rounded-full border border-yellow font-semibold text-yellow text-[18px]"
          onClick={onConnectCliked}
        >
          {connectedAddress ? connectedAddress : 'Connect Wallet'}
        </button>
      </nav>
    </header>
  );
}

export default Header;
