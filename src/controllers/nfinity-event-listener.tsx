import React, { useEffect } from "react";
import { useAppDispatch } from "../store";
import { getNfinityContract } from "../utils/contracts/nfinity";
import { addNewEvent } from "../store/reducers/accountSlice";
import { BigNumber } from "ethers";

const NfinityEventListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const nfinity = getNfinityContract();

    nfinity.on(
      "EventCreated",
      (eventId: BigNumber, externalId: string, organizer: string) => {
        console.log("New Event Created:", eventId, externalId, organizer);
        dispatch(addNewEvent({ organizer, eventId: eventId.toNumber() }));
      }
    );
  }, []);

  return <></>;
};

export default NfinityEventListener;
