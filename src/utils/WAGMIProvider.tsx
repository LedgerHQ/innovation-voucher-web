import { Provider, chain } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const connectors = [
  new WalletConnectConnector({
    chains: [chain.polygonMainnet],
    options: { qrcode: true },
  }),
];

const WAGMIProvider = ({ children }: { children: JSX.Element }) => (
  <Provider autoConnect connectors={connectors}>
    {children}
  </Provider>
);

export default WAGMIProvider;
