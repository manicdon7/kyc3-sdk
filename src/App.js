
import React, { useState, useEffect } from 'react';
import Connect from './components/Connect';
import { initializeContract, submitKYC, getKYCDetails, getAllKYCData, verifyKYC, getKYCDataBySigner } from './ContractIntegration';

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [kycRecords, setKYCRecords] = useState([]);

  useEffect(() => {
    async function initialize() {
      try {
        const { provider, signer, address, contract } = await initializeContract();
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setContract(contract);
      } catch (error) {
        console.error('Error initializing contract:', error);
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
      const signerAddress = await contract.signer.getAddress();
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
