import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("https://apothem.xdcrpc.com");

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
