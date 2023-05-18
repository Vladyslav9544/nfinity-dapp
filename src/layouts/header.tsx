import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

const Header = () => {
  return (
    <header className="flex items-center py-3 px-6 bg-gray-800 shadow-xl">
      <div className="mr-auto flex items-center">
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-12 h-12 rounded-full block mr-2"
        />
        <div className="text-xl text-white font-bold">NFINITY</div>
      </div>
      <ConnectButton />
    </header>
  );
};

export default Header;
