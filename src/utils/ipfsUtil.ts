import { useMemo } from 'react';
import axios from 'axios';

// returns null on errors
export const getIPFSHash = async (file: File) => {
  const PINATA_API_KEY = 'e140167157ef4f94bc5c';
  const PINATA_API_SECRET = '8efd26505f334a524f640b58afec4b1a82d1b8f829ccc12efdf8d382bd120fdd';

  if (!PINATA_API_KEY || !PINATA_API_SECRET) return null;

  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
  });
  formData.append('pinataMetadata', metadata);

  try {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const response = await axios.post(url, formData, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null
  }
}
