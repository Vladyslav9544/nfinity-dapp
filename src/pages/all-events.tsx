import React, { useState } from "react";
import { useAppSelector } from "../store";
import Pagination from "@mui/material/Pagination";
import EventDetail from "../components/event-detail";

const AllEvents = () => {
  const eventCount = useAppSelector((state) => state.nfinity.counterEvents);

  const [eventId, setEventId] = useState(1);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Events ({eventCount})
        </h1>
        {eventCount && (
          <Pagination
            count={eventCount}
            color="primary"
            page={eventId}
            onChange={(_, p) => setEventId(p)}
          />
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <EventDetail eventId={eventId} />
      </div>
    </div>
  );
};

export default AllEvents;
