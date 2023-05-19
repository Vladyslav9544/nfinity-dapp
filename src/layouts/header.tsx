import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

const Header = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  return (
    <header className="flex items-center py-3 px-6 bg-gray-800 shadow-xl">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-12 h-12 rounded-full block mr-2"
        />
        <div className="text-xl text-white font-bold">NFINITY</div>
      </div>
      <nav className="flex gap-3 mr-auto ml-10">
        <Link to="/">
          <div className="py-2 px-4 rounded bg-transparent hover:bg-white/10 transition-all text-white/80 hover:text-white">
            Home
          </div>
        </Link>
        <Link to="/events">
          <div className="py-2 px-4 rounded bg-transparent hover:bg-white/10 transition-all text-white/80 hover:text-white">
            Events
          </div>
        </Link>
        {address && (
          <div className="group cursor-pointer relative">
            <div className="py-2 px-4 rounded bg-transparent hover:bg-white/10 transition-all text-white/80 hover:text-white">
              Account
            </div>
            <div className="absolute top-10 left-0 pt-3 hidden group-hover:block">
              <div className="p-2 bg-slate-700 rounded shadow-[1px_1px_2px_0_black]">
                <Link to={"/account/events"}>
                  <div className="text-white/80 text-center w-28 py-2 rounded hover:bg-white/10 hover:text-white transition-all">
                    Events
                  </div>
                </Link>
                <Link to={"/account/purchases"}>
                  <div className="text-white/80 text-center w-28 py-2 rounded hover:bg-white/10 hover:text-white transition-all">
                    Purchases
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      <ConnectButton />
    </header>
  );
};

export default Header;
