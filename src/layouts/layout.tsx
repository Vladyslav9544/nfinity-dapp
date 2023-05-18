import React from "react";
import Header from "./header";
import Footer from "./footer";
import AccountInformation from "../components/account-information";
import Container from "@mui/material/Container";
import StoreInformation from "../components/store-information";

type Props = {};

const MainLayout = (props: Props) => {
  return (
    <div>
      <Header />
      <main className="my-20">
        <Container>
          <div className="flex flex-col gap-5">
            <AccountInformation />
            <StoreInformation />
          </div>
        </Container>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
