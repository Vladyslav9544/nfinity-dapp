import React, { useEffect, useState } from "react";
import { EventDetailInterface, EventStatus } from "../types/types";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import {
  cancelEvent,
  completeEvent,
  endTicketSale,
  getEventDetailById,
  purhcaseTickets,
  settleEvent,
  startTicketSale,
  suspendTicketSale,
} from "../utils/contracts/nfinity";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { EventStatusLabels, NotifyMessages } from "../config/constants";
import { formatEther } from "ethers/lib/utils.js";
import { MainChain } from "../config/config";
import { isSameAddress } from "../utils/helpers";
import { useAccount, useSigner } from "wagmi";
import TextField from "@mui/material/TextField";
import { BigNumber } from "ethers";
import { useAppDispatch } from "../store";
import { setTxPending } from "../store/reducers/appSlice";
import { toast } from "react-toastify";

enum Status {
  Loading,
  Error,
  Success,
}

interface Props {
  eventId: number;
}

const DefaultValue = {
  externalId: "External ID",
  customerId: "Customer ID",
  quantity: 1,
};

const EventDetail = ({ eventId }: Props) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState(Status.Loading);
  const [eventDetail, setEventDetail] = useState<EventDetailInterface>();
  const [quantity, setQuantity] = useState(DefaultValue.quantity);
  const [externalId, setExternalId] = useState(DefaultValue.externalId);
  const [customerId, setCustomerId] = useState(DefaultValue.customerId);

  useEffect(() => {
    init();
  }, [eventId]);

  const init = async () => {
    setEventDetail(undefined);
    setStatus(Status.Loading);

    try {
      setEventDetail(await getEventDetailById(eventId));
      setStatus(Status.Success);
    } catch (error) {
      console.error("initEventDetail", error);
      setStatus(Status.Error);
    }
  };

  const handlePurchase = async () => {
    if (!eventDetail || !address || !signer) return;
    const totalPrice = BigNumber.from(eventDetail.ticketPrice).mul(
      BigNumber.from(quantity)
    );

    dispatch(setTxPending(true));

    try {
      await purhcaseTickets(
        eventId,
        quantity,
        externalId,
        customerId,
        totalPrice,
        address,
        signer
      );
    } catch (error) {
      console.error("purchase Tickets: ", error);
      toast(NotifyMessages.DefaultError, { type: "error" });
    }

    dispatch(setTxPending(false));
  };

  const handleEventControl = async (st: EventStatus) => {
    if (!eventDetail || !address || !signer) return;

    dispatch(setTxPending(true));

    try {
      switch (st) {
        case EventStatus.SalesFinished:
          await endTicketSale(eventId, address, signer);
          break;
        case EventStatus.SalesStarted:
          console.log("start");
          await startTicketSale(eventId, address, signer);
          break;
        case EventStatus.SalesSuspended:
          await suspendTicketSale(eventId, address, signer);
          break;
        case EventStatus.Cancelled:
          await cancelEvent(eventId, address, signer);
          break;
        case EventStatus.Completed:
          await completeEvent(eventId, address, signer);
          break;
        case EventStatus.Settled:
          await settleEvent(eventId, address, signer);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`${EventStatusLabels[st]}: `, error);
      toast(NotifyMessages.DefaultError, { type: "error" });
    }

    dispatch(setTxPending(false));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4}>
        <div className="border-b-2 border-b-slate-300 px-5 py-3 flex items-center justify-between">
          <div className=" text-lg font-bold text-slate-700">
            Event #{eventId}
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
        ) : eventDetail ? (
          <div className="p-5">
            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">Status: </span>
              {EventStatusLabels[eventDetail.status]}
            </div>

            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">Organizer: </span>
              {address && isSameAddress(eventDetail.organizer, address) ? (
                <span className="text-green-700 font-bold">YOU</span>
              ) : (
                eventDetail.organizer
              )}
            </div>

            <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2">
              <span className="font-bold text-slate-700">External ID: </span>
              <span className="text-sm">{eventDetail.externalId}</span>
            </div>

            <div className="flex gap-3">
              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">
                  Tickets on Sale:{" "}
                </span>
                {eventDetail.ticketsOnSale}
              </div>

              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">Tickets sold: </span>
                {eventDetail.ticketsSold}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">Ticket Price: </span>
                {parseFloat(formatEther(eventDetail.ticketPrice)).toFixed(
                  3
                )}{" "}
                {MainChain.nativeCurrency.symbol}
              </div>

              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">Tickets Left: </span>
                {eventDetail.ticketsLeft}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">
                  Store Incentive:{" "}
                </span>
                {eventDetail.storeIncentive} %
              </div>

              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">
                  Tickets Cancelled:{" "}
                </span>
                {eventDetail.ticketsCancelled}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">
                  Total Balance:{" "}
                </span>
                {parseFloat(eventDetail.balance.toFixed(3))}{" "}
                {MainChain.nativeCurrency.symbol}
              </div>

              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">
                  Tickets Checked in:{" "}
                </span>
                {eventDetail.ticketsCheckedIn}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">
                  Refunded Balance:{" "}
                </span>
                {parseFloat(eventDetail.refundableBalance.toFixed(3))}{" "}
                {MainChain.nativeCurrency.symbol}
              </div>

              <div className="border-b-[1px] border-b-slate-200 px-3 pt-3 pb-2 w-0 grow">
                <span className="font-bold text-slate-700">
                  Tickets Refunded:{" "}
                </span>
                {eventDetail.ticketsRefunded}
              </div>
            </div>

            {address && isSameAddress(address, eventDetail.organizer) && (
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex gap-3">
                  <Button
                    variant="outlined"
                    className="w-0 grow !px-0"
                    color="error"
                    onClick={() =>
                      handleEventControl(EventStatus.SalesFinished)
                    }
                  >
                    End Sale
                  </Button>
                  <Button
                    variant="outlined"
                    className="w-0 grow !px-0"
                    color="warning"
                    onClick={() =>
                      handleEventControl(EventStatus.SalesSuspended)
                    }
                  >
                    Suspend Sale
                  </Button>
                  <Button
                    variant="outlined"
                    className="w-0 grow !px-0"
                    color="success"
                    onClick={() => handleEventControl(EventStatus.SalesStarted)}
                  >
                    Start Sale
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="contained"
                    className="w-0 grow !px-0"
                    color="error"
                    onClick={() => handleEventControl(EventStatus.Cancelled)}
                  >
                    Cancel Event
                  </Button>
                  <Button
                    variant="contained"
                    className="w-0 grow !px-0"
                    color="warning"
                    onClick={() => handleEventControl(EventStatus.Settled)}
                  >
                    Settle Event
                  </Button>
                  <Button
                    variant="contained"
                    className="w-0 grow !px-0"
                    color="success"
                    onClick={() => handleEventControl(EventStatus.Completed)}
                  >
                    Complete Event
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </Paper>

      {address &&
        status === Status.Success &&
        eventDetail &&
        eventDetail.status === EventStatus.SalesStarted && (
          <div className="bg-slate-100 rounded shadow-sm shadow-slate-700 border-2 border-slate-100 mt-10">
            <div className="px-5 py-3 text-lg font-bold text-slate-700 border-b-2 border-b-slate-300">
              Purchase
            </div>
            <div className="m-3 flex flex-col gap-4">
              <TextField
                variant="outlined"
                label={"Quantity"}
                size="small"
                defaultValue={1}
                fullWidth
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? 0 : parseInt(e.target.value)
                  )
                }
              />
              <TextField
                variant="outlined"
                label={"External ID"}
                size="small"
                defaultValue={DefaultValue.externalId}
                fullWidth
                onChange={(e) => setExternalId(e.target.value)}
              />
              <TextField
                variant="outlined"
                label={"Customer ID"}
                size="small"
                defaultValue={DefaultValue.customerId}
                fullWidth
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <TextField
                variant="outlined"
                label={"Puchase Price"}
                size="small"
                value={`${
                  parseFloat(formatEther(eventDetail.ticketPrice)) * quantity
                } ${MainChain.nativeCurrency.symbol}`}
              />
              <Button
                variant="contained"
                color="primary"
                className="ml-auto"
                onClick={handlePurchase}
              >
                Purchase
              </Button>
            </div>
          </div>
        )}
    </Container>
  );
};

export default EventDetail;
