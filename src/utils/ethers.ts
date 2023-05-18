import { ethers } from "ethers";
import { RPC_URL } from "../config/config";

export const getReadonlyProvider = () => {
  return new ethers.providers.StaticJsonRpcProvider(RPC_URL);
};
