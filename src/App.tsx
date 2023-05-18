import React, { useEffect } from "react";
import MainLayout from "./layouts/layout";
import { useAppDispatch } from "./store";
import { initializeStoreInformation } from "./store/reducers/nfinitySlice";
import { useAccount } from "wagmi";
import {
  loadAccountBalance,
  loadAccountInformation,
  setAccountAddress,
  setAccountStateToInitial,
} from "./store/reducers/accountSlice";
import NfinityEventListener from "./controllers/nfinity-event-listener";

function App() {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  useEffect(() => {
    dispatch(initializeStoreInformation());

    const intervalId = setInterval(() => {
      dispatch(initializeStoreInformation());
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (address) {
      dispatch(setAccountAddress(address));
      dispatch(loadAccountInformation(address));
    } else {
      dispatch(setAccountStateToInitial());
    }

    let timeId: any;
    if (address) {
      timeId = setInterval(() => dispatch(loadAccountBalance(address)), 5000);
    }

    return () => {
      if (timeId) {
        clearInterval(timeId);
      }
    };
  }, [address]);

  return (
    <div className="App">
      <NfinityEventListener />
      <MainLayout />
    </div>
  );
}

export default App;
