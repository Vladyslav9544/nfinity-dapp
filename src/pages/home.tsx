import React from "react";
import StoreInformation from "../components/store-information";
import AccountInformation from "../components/account-information";
import CreateEvent from "../components/create-event";
import { useAccount } from "wagmi";
import { useAppSelector } from "../store";

const Home = () => {
  const { address } = useAccount();
  const accountInfo = useAppSelector((state) => state.account);

  return (
    <div className="flex flex-col gap-10">
      <StoreInformation />
      {address && <AccountInformation />}
      {accountInfo.accountIsOwner && <CreateEvent />}
    </div>
  );
};

export default Home;
