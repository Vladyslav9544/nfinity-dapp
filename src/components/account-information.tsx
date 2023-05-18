import Paper from "@mui/material/Paper";
import React from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ethers } from "ethers";
import { MainChain } from "../config/config";

const AccountInformation = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address, chainId });

  return (
    <Paper elevation={4}>
      <div className="p-4 border-b-2 border-b-gray-200 font-bold text-lg text-gray-600">
        Account Information
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">Address: </span>
        {address ? address : ""}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">Balance: </span>
        {balance
          ? `${parseFloat(ethers.utils.formatEther(balance.value)).toFixed(
              3
            )} ${MainChain.nativeCurrency.symbol}`
          : ""}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">Role: </span>
      </div>
    </Paper>
  );
};

export default AccountInformation;
