import { useState } from 'react';
import { getIPFSHash } from '../utils/ipfsUtil';
import { IPFSProps } from '../types/props';
const IPFSLogo: React.FC<IPFSProps> = ({ onChange }) => {
  const [file, setFile] = useState<any | null>(null);
  const [imgSrc, setImgSrc] = useState<any | null>(null);
  const [ipfsHash, setIpfsHash] = useState('');

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      const temp = e.target.files[0];
      if (temp) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          setImgSrc(e.target.result);
        };
        reader.readAsDataURL(temp);
      }
    }
  };

  // Upload file to Pinata
  const handleUploadToIPFS = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const hash = await getIPFSHash(file);
    onChange(`https://gateway.pinata.cloud/ipfs/${hash}`);
    setIpfsHash(hash);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-grey-bright/10 bg-grey-dark inner-shadow">
      <div className="relative items-center">
        <div className="relative w-[80px] h-[80px] rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <input
            type="file"
            className="absolute opacity-0 w-full h-full"
            onChange={handleFileChange}
          />
          <img src={imgSrc} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-center mb-2">
          <button
            className="px-6 py-1 rounded-xl border border-grey-bright font-bold text-grey-bright text-md"
            onClick={handleUploadToIPFS}
          >
            Upload
          </button>
        </div>
        <input
          type="text"
          readOnly
          placeholder="IPFS Address"
          value={ipfsHash || 'No file uploaded'}
          className="flex-1 ml-5 p-2 rounded-lg bg-dark border border-grey-bright/10 text-grey-bright outline-none"
        />
      </div>
    </div>
  );
};

export default IPFSLogo;
