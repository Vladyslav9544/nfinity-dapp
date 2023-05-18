import { configureChains, createClient } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

export const chains = [mainnet, goerli];

const { provider, webSocketProvider } = configureChains(chains, [
  alchemyProvider({ apiKey: "KVzlV4L6NLTGLSUts4ZKdHTkzxng7wDv" }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  // connectors: [
  //   new MetaMaskConnector(),
  //   new CoinbaseWalletConnector({
  //     chains,
  //     options: { appName: "NFINITY" },
  //   }),
  //   new WalletConnectConnector({
  //     chains,
  //     options: {
  //       projectId: "5cee8bf693e91f608c0bb70b1af1bc5e",
  //     },
  //   }),
  // ],
  provider,
  webSocketProvider,
});
