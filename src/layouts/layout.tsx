import React from "react";
import Header from "./header";
import Footer from "./footer";
import AccountInformation from "../components/account-information";
import Container from "@mui/material/Container";
import StoreInformation from "../components/store-information";
import { useAccount } from "wagmi";
import { useAppSelector } from "../store";
import TxPendingSpinner from "../components/txpending-spinner";
import CreateEvent from "../components/create-event";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import AllEvents from "../pages/all-events";
import AccountEvents from "../pages/account-events";
import AccountPurchases from "../pages/account-purchases";

const MainLayout = () => {
  const { address } = useAccount();
  const txPending = useAppSelector((state) => state.app.txPending);
  const accountInfo = useAppSelector((state) => state.account);

  return (
    <div>
      {txPending && <TxPendingSpinner />}
      <Header />
      <main className="my-20">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<AllEvents />} />
            <Route path="/account/events" element={<AccountEvents />} />
            <Route path="/account/purchases" element={<AccountPurchases />} />
          </Routes>
        </Container>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
