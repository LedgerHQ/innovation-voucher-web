import { Provider, chain } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";

const chains = [chain.polygonMainnet];

const connectors = [
  new WalletConnectConnector({
    options: { qrcode: true },
    chains,
  }),
  new InjectedConnector({ chains }),
];

const WAGMIProvider = ({ children }: { children: JSX.Element }) => (
  <Provider autoConnect connectors={connectors}>
    {children}
  </Provider>
);

export default WAGMIProvider;
