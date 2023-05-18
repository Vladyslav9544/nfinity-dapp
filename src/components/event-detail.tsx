import React, { useEffect, useState } from "react";
import { EventDetailInterface, EventStatus } from "../types/types";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { getEventDetailById } from "../utils/contracts/nfinity";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { EventStatusLabels } from "../config/constants";
import { formatEther } from "ethers/lib/utils.js";
import { MainChain } from "../config/config";

enum Status {
  Loading,
  Error,
  Success,
}

interface Props {
  eventId: number;
}

const EventDetail = ({ eventId }: Props) => {
  const [status, setStatus] = useState(Status.Loading);
  const [eventDetail, setEventDetail] = useState<EventDetailInterface>();

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
              {eventDetail.organizer}
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
          </div>
        ) : (
          ""
        )}
      </Paper>
    </Container>
  );
};

export default EventDetail;
