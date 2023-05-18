import Paper from "@mui/material/Paper";
import React from "react";
import { useAppSelector } from "../store";

type Props = {};

const StoreInformation = (props: Props) => {
  const storeInfo = useAppSelector((state) => state.nfinity);

  return (
    <Paper elevation={4}>
      <div className="p-4 border-b-2 border-b-gray-200 font-bold text-lg text-gray-600">
        Store <span>{storeInfo.name}</span>
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">Owner: </span>
        {storeInfo.owner}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">status: </span>
        {storeInfo.status}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">settledBalance: </span>
        {storeInfo.settledBalance}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">excessBalance: </span>
        {storeInfo.excessBalance}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">refundableBalance: </span>
        {storeInfo.refundableBalance}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">counterEvents: </span>
        {storeInfo.counterEvents}
      </div>
      <div className="px-3 py-2">
        <span className="font-bold">counterPurchases: </span>
        {storeInfo.counterPurchases}
      </div>
    </Paper>
  );
};

export default StoreInformation;
