    import { ethers } from 'ethers';
    import Abi from './abi/abi.json';

    export async function initializeContract() {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const myContractAddress = "0xDF203bE9AC56E75599A75417EbEA005ef6580cfb";
          const contract = new ethers.Contract(
            myContractAddress,
            Abi,
            signer
          );
          return { provider, signer, address, contract };
        } else {
          throw new Error("MetaMask not found");
        }
      } catch (error) {
        console.error('Error initializing contract:', error);
        throw error;
      }
    }


    export async function submitKYC(contract, name, userId) {
      const submitTx = await contract.submitKYC(name, userId, { gasLimit: 500000 });
      await submitTx.wait();
    }


    export async function getKYCDetails(contract, index) {
      return await contract.getKYCDetails(index);
    }

  export async function getKYCDataBySigner(contract, signerAddress) {
    const signerKYCs = await contract.getKYCDataBySigner(signerAddress);
    return signerKYCs;
  }

  export async function verifyKYC(contract, index) {
    const verifyTx = await contract.verifyKYC(index, { gasLimit: 500000 });
    await verifyTx.wait();
  }

  export async function getAllKYCData(contract) {
    try {
      const kycRecords = await contract.getAllKYCData();
      return kycRecords;
    } catch (error) {
      console.error('Error fetching all KYC data:', error);
      throw error;
    }
  }
