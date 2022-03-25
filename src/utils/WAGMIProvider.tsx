import { Provider, chain } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";

// @dev: Strictly allow Polygon on prod, and Kovan on dev mode.
//       If we wanna support more networks, we should write an
//       utils function to manage them in a better way.
const chains = [chain.polygonMainnet, chain.kovan];

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
