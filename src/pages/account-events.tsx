import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store";
import Pagination from "@mui/material/Pagination";
import EventDetail from "../components/event-detail";

const AccountEvents = () => {
  const eventCount = useAppSelector((state) => state.nfinity.counterEvents);

  const accountEvents = useAppSelector(
    (state) => state.account.accountEventIds
  );

  const [eventId, setEventId] = useState(accountEvents[0] || 1);

  useEffect(() => {
    setEventId(accountEvents[0]);
  }, [accountEvents]);

  return (
    <>
      {accountEvents.length === 0 ? (
        <div></div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">
              Events ({eventCount})
            </h1>
            <Pagination
              count={accountEvents.length}
              color="primary"
              onChange={(_, p) => setEventId(accountEvents[p - 1])}
            />
          </div>

          <div className="mt-10 flex justify-center">
            <EventDetail eventId={eventId} />
          </div>
        </div>
      )}
    </>
  );
};

export default AccountEvents;
