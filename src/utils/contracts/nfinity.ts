import { Signer, ethers, providers } from "ethers";
import { Nfinity__factory } from "../../types/contracts";
import { NfinityAddress } from "../../config/config";
import { getReadonlyProvider } from "../ethers";

export const getNfinityContract = (
  provider?: ethers.Signer | ethers.providers.Provider
) => {
  if (!provider) {
    provider = getReadonlyProvider();
  }
  return Nfinity__factory.connect(NfinityAddress, provider);
};

//==============================================================================
//----------------------------     Read Methods     ----------------------------
//==============================================================================

export const getStoreInfo = async () => {
  const contract = getNfinityContract();
  const res = await contract.fetchStoreInfo();

  return {
    owner: res.storeOwner,
    status: res.storeStatus.toNumber(),
    name: res.storeName,
    settledBalance: parseFloat(
      ethers.utils.formatEther(res.storeSettledBalance)
    ),
    excessBalance: parseFloat(ethers.utils.formatEther(res.storeExcessBalance)),
    refundableBalance: parseFloat(
      ethers.utils.formatEther(res.storeRefundableBalance)
    ),
    counterEvents: res.storeCounterEvents.toNumber(),
    counterPurchases: res.storeCounterPurchases.toNumber(),
  };
};

export const getAccountRole = async (address: string) => {
  const contract = getNfinityContract();

  const res = await contract.getAccountRole(address);

  return res;
};

//==============================================================================
//----------------------------    Write Methods     ----------------------------
//==============================================================================

export const openStore = async (
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);

  const tx = await contract.openStore({ from: fromAddress });
  await tx.wait();
};

export const closeStore = async (
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);

  const tx = await contract.closeStore({ from: fromAddress });
  await tx.wait();
};

export const suspendStore = async (
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);

  const tx = await contract.suspendStore({ from: fromAddress });
  await tx.wait();
};
