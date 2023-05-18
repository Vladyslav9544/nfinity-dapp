import React, { useEffect } from "react";
import MainLayout from "./layouts/layout";
import { useAppDispatch } from "./store";
import { initializeStoreInformation } from "./store/reducers/nfinitySlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeStoreInformation());
  }, []);

  return (
    <div className="App">
      <MainLayout />
    </div>
  );
}

export default App;
