import Paper from "@mui/material/Paper";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { NotifyMessages, StoreStatusLabels } from "../config/constants";
import { MainChain } from "../config/config";
import { StoreStatus } from "../types/types";
import Button from "@mui/material/Button";
import { setTxPending } from "../store/reducers/appSlice";
import { toast } from "react-toastify";
import {
  closeStore,
  openStore,
  suspendStore,
} from "../utils/contracts/nfinity";
import { useAccount, useSigner } from "wagmi";
import { setStorStatus } from "../store/reducers/nfinitySlice";

type Props = {};

const StoreInformation = (props: Props) => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const storeInfo = useAppSelector((state) => state.nfinity);
  const accountInfo = useAppSelector((state) => state.account);

  const handleCloseStore = async () => {
    if (!address || !signer) return;
    dispatch(setTxPending(true));

    try {
      await closeStore(address, signer);
      toast(NotifyMessages.DefaultSuccess, { type: "success" });
      dispatch(setStorStatus(StoreStatus.Closed));
    } catch (error) {
      toast(NotifyMessages.DefaultError, { type: "error" });
    }

    dispatch(setTxPending(false));
  };

  const handleSuspendStore = async () => {
    if (!address || !signer) return;
    dispatch(setTxPending(true));

    try {
      await suspendStore(address, signer);
      toast(NotifyMessages.DefaultSuccess, { type: "success" });
      dispatch(setStorStatus(StoreStatus.Suspended));
    } catch (error) {
      toast(NotifyMessages.DefaultError, { type: "error" });
    }

    dispatch(setTxPending(false));
  };

  const handleOpenStore = async () => {
    if (!address || !signer) return;
    dispatch(setTxPending(true));

    try {
      await openStore(address, signer);
      toast(NotifyMessages.DefaultSuccess, { type: "success" });
      dispatch(setStorStatus(StoreStatus.Open));
    } catch (error) {
      toast(NotifyMessages.DefaultError, { type: "error" });
    }

    dispatch(setTxPending(false));
  };

  return (
    <Paper elevation={4} sx={{ backgroundColor: "primary" }}>
      <div className="p-4 border-b-2 border-b-gray-200 font-bold text-lg text-gray-600">
        Store <span>{storeInfo.name}</span>
      </div>
      <div className="py-2">
        <div className="px-5 py-2">
          <span className="font-bold">Owner: </span>
          {storeInfo.owner}
        </div>
        <div className="px-5 py-2">
          <span className="font-bold">Status: </span>
          {StoreStatusLabels[storeInfo.status]}
        </div>
        <div className="px-5 py-2">
          <span className="font-bold">Settled Balance: </span>
          {storeInfo.settledBalance} {MainChain.nativeCurrency.symbol}
        </div>
        <div className="px-5 py-2">
          <span className="font-bold">Excess Balance: </span>
          {storeInfo.excessBalance} {MainChain.nativeCurrency.symbol}
        </div>
        <div className="px-5 py-2">
          <span className="font-bold">Refundable Balance: </span>
          {storeInfo.refundableBalance} {MainChain.nativeCurrency.symbol}
        </div>
        <div className="px-5 py-2">
          <span className="font-bold">Events created so far: </span>
          {storeInfo.counterEvents}
        </div>
        <div className="px-5 py-2">
          <span className="font-bold">Purchases completed so far: </span>
          {storeInfo.counterPurchases}
        </div>
        <div className="flex gap-3 px-5 py-4">
          <Button
            variant="contained"
            color="warning"
            onClick={handleSuspendStore}
            className="disabled:cursor-not-allowed"
            disabled={
              !accountInfo.accountIsOwner ||
              storeInfo.status === StoreStatus.Suspended
            }
          >
            Suspend Store
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleCloseStore}
            className="disabled:cursor-not-allowed"
            disabled={
              !accountInfo.accountIsOwner ||
              storeInfo.status === StoreStatus.Closed
            }
          >
            Close Store
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleOpenStore}
            className="disabled:cursor-not-allowed"
            disabled={
              !accountInfo.accountIsOwner ||
              !(
                storeInfo.status === StoreStatus.Created ||
                storeInfo.status === StoreStatus.Suspended
              )
            }
          >
            Open Store
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default StoreInformation;
