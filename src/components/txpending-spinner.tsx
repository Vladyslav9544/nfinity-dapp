import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

type Props = {};

const TxPendingSpinner = (props: Props) => {
  return (
    <div className="fixed left-0 top-0 w-screen h-screen backdrop-blur-sm z-50 flex items-center justify-center bg-gray-500/50">
      <CircularProgress />
    </div>
  );
};

export default TxPendingSpinner;
