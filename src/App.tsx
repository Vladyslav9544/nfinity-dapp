import React, { useEffect } from "react";
import MainLayout from "./layouts/layout";
import { useAppDispatch } from "./store";
import { initializeStoreInformation } from "./store/reducers/nfinitySlice";
import { useAccount } from "wagmi";
import {
  loadAccountBalance,
  loadAccountInformation,
  setAccountStateToInitial,
} from "./store/reducers/accountSlice";

function App() {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  useEffect(() => {
    dispatch(initializeStoreInformation());
  }, []);

  useEffect(() => {
    if (address) {
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
      <MainLayout />
    </div>
  );
}

export default App;
