import React from "react";
import Header from "./header";
import Footer from "./footer";
import AccountInformation from "../components/account-information";
import Container from "@mui/material/Container";
import StoreInformation from "../components/store-information";
import { useAccount } from "wagmi";
import { useAppSelector } from "../store";
import TxPendingSpinner from "../components/txpending-spinner";

const MainLayout = () => {
  const { address } = useAccount();
  const txPending = useAppSelector((state) => state.app.txPending);

  return (
    <div>
      {txPending && <TxPendingSpinner />}
      <Header />
      <main className="my-20">
        <Container>
          <div className="flex flex-col gap-10">
            {address && <AccountInformation />}
            <StoreInformation />
          </div>
        </Container>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
