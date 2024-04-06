import React, { useState, useEffect } from 'react';
import { submitKYC, getKYCDetails, getKYCDataBySigner, verifyKYC, getAllKYCData } from './ContractIntegration';
import Connect from './components/Connect';
import { ethers }from 'ethers';
import Abi from './abi/abi.json'

const App = () => {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState([]);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [kycRecords, setKYCRecords] = useState([]);

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);
        const signer = provider.getSigner();
        console.log(signer);
        const address = await signer.getAddress();
        console.log(address)
        const balance = await provider.getBalance(address);
        setAddress(address);
        //setBalance(ethers?.utils?.parseEther(balance));
        const myContractAddress = "0xA008C9f80F637E865B93554939d37FF69136A0E3";
        const contract = new ethers.Contract(
          myContractAddress,
          Abi,
          signer
        );
        console.log(contract);
        setContract(contract);
      }
    }
    initialize();
  }, []);


  const handleSubmitKYC = async () => {
    try {
      await submitKYC(contract, name, userId);
      console.log('KYC submitted successfully.');
    } catch (error) {
      console.error('Error submitting KYC:', error);
    }
  };

  const handleGetKYCDataBySigner = async () => {
    try {
      if (!contract) {
        console.error('Contract is not initialized.');
        return;
      }
      const signerAddress = await contract.signer.getAddress(); // Get signer address
      const records = await getKYCDataBySigner(contract, signerAddress);
      setKYCRecords(records);
      console.log('All KYC Data:', records);
    } catch (error) {
      console.error('Error getting all KYC data:', error);
    }
  };

  const handleVerifyKYC = async (index) => {
    try {
      if (!contract) {
        console.error('Contract is not initialized.');
        return;
      }
      await verifyKYC(contract, index);
      console.log('KYC verified successfully.');
    } catch (error) {
      console.error('Error verifying KYC:', error);
    }
  };

  const handleGetAllKYCData = async () => {
    try {
      if (!contract) {
        console.error('Contract is not initialized.');
        return;
      }
      const records = await getAllKYCData(contract);
      setKYCRecords(records);
      console.log('All KYC Data:', records);
    } catch (error) {
      console.error('Error getting all KYC data:', error);
    }
  };
  
  return (
    <div>
      <Connect />
      <h1>KYC Verification App</h1>
      <button onClick={handleGetAllKYCData}>Get All KYC Data</button>
      <div>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={handleSubmitKYC}>Submit KYC</button>
      </div>
      <div>
        <button onClick={() => handleGetKYCDataBySigner()}>Get KYC Data By Signer</button>
        <ul>
          {kycRecords.map((record, index) => (
            <li key={index}>
              <p>Signer: {record[0]}</p>
              <p>Name: {record[1]}</p>
              <p>User ID: {record[2]}</p>
              <p>Verified: {record[3].toString()}</p>
      <div>
          <button onClick={() => handleVerifyKYC(index)}>Verify KYC</button>
        </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
