import { ethers } from "ethers";
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

//==============================================================================
//----------------------------    Write Methods     ----------------------------
//==============================================================================
