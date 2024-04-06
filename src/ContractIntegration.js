import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("https://apothem.xdcrpc.com");

export async function submitKYC(contract, name, userId) {
  const submitTx = await contract.submitKYC(name, userId, { gasLimit: 500000 });
  await submitTx.wait();
}

export async function getKYCDetails(contract, index) {
  return await contract.getKYCDetails(index);
}

export async function getAllKYCData(contract) {
  return await contract.getAllKYCData();
}
