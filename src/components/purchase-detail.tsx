import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { isSameAddress } from "../utils/helpers";
import {
  cancelPurchase,
  checkInPurchase,
  getPurchaseDetailById,
  refundPurchase,
} from "../utils/contracts/nfinity";
import { NotifyMessages, PurchaseStatusLabels } from "../config/constants";
import { PurchaseDetailInterface, PurchaseStatus } from "../types/types";
import { MainChain } from "../config/config";
import { useAppDispatch } from "../store";
import { setTxPending } from "../store/reducers/appSlice";
import { toast } from "react-toastify";

enum Status {
  Loading,
  Error,
  Success,
}
interface Props {
  purchaseId: number;
}

const PurchaseDetail = ({ purchaseId }: Props) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState(Status.Loading);
  const [purchaseDetail, setPurchaseDetail] =
    useState<PurchaseDetailInterface>();

  useEffect(() => {
    init();
  }, [purchaseId]);

  const init = async () => {
    setPurchaseDetail(undefined);
    setStatus(Status.Loading);

    try {
      const detail = await getPurchaseDetailById(purchaseId);
      setPurchaseDetail(detail);
      setStatus(Status.Success);
    } catch (error) {
      console.error("initPurchaseDetail", error);
      setStatus(Status.Error);
    }
  };

  const handleEventControl = async (st: PurchaseStatus) => {
    if (!purchaseDetail || !address || !signer) return;

    dispatch(setTxPending(true));

    try {
      switch (st) {
        case PurchaseStatus.Cancelled:
          await cancelPurchase(purchaseId, address, signer);
          break;
        case PurchaseStatus.Refunded:
          await refundPurchase(
            purchaseDetail.eventId,
            purchaseId,
            address,
            signer
          );
          break;
        case PurchaseStatus.CheckedIn:
          await checkInPurchase(purchaseId, address, signer);
          break;
        default:
          break;
      }

      toast(NotifyMessages.DefaultSuccess, { type: "success" });
      setPurchaseDetail((prev) =>
        !prev ? undefined : { ...prev, status: st }
      );
    } catch (error) {
      console.error(`${PurchaseStatusLabels[st]}: `, error);
      toast(NotifyMessages.DefaultError, { type: "error" });
    }

    dispatch(setTxPending(false));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4}>
        <div className="border-b-2 border-b-slate-300 px-5 py-3 flex items-center justify-between">
          <div className=" text-lg font-bold text-slate-700">
            Purchase #{purchaseId}
          </div>
          <IconButton size="small" onClick={init}>
            <RefreshRoundedIcon fontSize="small" />
          </IconButton>
        </div>
        {status === Status.Loading ? (
          <div className="w-full h-80 flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : status === Status.Error ? (
          <div className="wfull h-80 flex flex-col items-center justify-center">
            <div className="font-bold text-slate-700 mb-3">
              Failed to fetch details
            </div>
            <Button variant="outlined" color="primary" onClick={init}>
              Reload
            </Button>
          </div>
        ) : purchaseDetail ? (
          <div className="p-5">
            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">Event Id: </span>
              {purchaseDetail.eventId}
            </div>

            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">Status: </span>
              {PurchaseStatusLabels[purchaseDetail.status]}
            </div>

            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">External ID: </span>
              <span className="text-sm">{purchaseDetail.externalId}</span>
            </div>

            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">Customer ID: </span>
              <span className="text-sm">{purchaseDetail.customerId}</span>
            </div>

            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">Quantity: </span>
              {purchaseDetail.quantity}
            </div>

            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">Total: </span>
              {parseFloat(purchaseDetail.total.toFixed(3))}{" "}
              {MainChain.nativeCurrency.symbol}
            </div>

            {address && isSameAddress(address, purchaseDetail.customer) && (
              <div className="flex gap-3 mt-5">
                <Button
                  variant="outlined"
                  className="w-0 grow !px-0"
                  color="error"
                  onClick={() => handleEventControl(PurchaseStatus.Cancelled)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  className="w-0 grow !px-0"
                  color="warning"
                  onClick={() => handleEventControl(PurchaseStatus.Refunded)}
                >
                  Refund
                </Button>
                <Button
                  variant="outlined"
                  className="w-0 grow !px-0"
                  color="success"
                  onClick={() => handleEventControl(PurchaseStatus.CheckedIn)}
                >
                  Check In
                </Button>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </Paper>
    </Container>
  );
};

export default PurchaseDetail;
