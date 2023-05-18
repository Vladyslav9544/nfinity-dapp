import Paper from "@mui/material/Paper";
import React from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ethers } from "ethers";
import { MainChain } from "../config/config";
import { useAppSelector } from "../store";

const AccountInformation = () => {
  const { address } = useAccount();
  const chainId = useChainId();

  const accountInfo = useAppSelector((state) => state.account);

  return (
    <Paper elevation={4}>
      <div className="p-4 border-b-2 border-b-gray-200 font-bold text-lg text-gray-600">
        Account Information
      </div>
      <div className="py-2">
        <div className="px-5 py-2">
          <span className="font-bold">Address: </span>
          {address ? address : ""}
        </div>
        <div className="px-5 py-2">
          <span className="font-bold">Balance: </span>
          {`${accountInfo.balance.toFixed(3)} ${
            MainChain.nativeCurrency.symbol
          }`}
        </div>
        <div className="px-5 py-2 flex items-center gap-2">
          <span className="font-bold">Role: </span>
          {accountInfo.accountIsOwner && (
            <span className="bg-green-700 text-white font-bold rounded-md py-[2px] px-2">
              OWNER
            </span>
          )}
          {accountInfo.accountIsOrganizer && (
            <span className="bg-blue-700 text-white font-bold rounded-md py-[2px] px-2">
              Organizer({accountInfo.accountEventIds.length})
            </span>
          )}
          {accountInfo.accountIsCustomer && (
            <span className="bg-teal-700 text-white font-bold rounded-md py-[2px] px-2">
              Customer({accountInfo.accountPurchaseIds.length})
            </span>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default AccountInformation;
