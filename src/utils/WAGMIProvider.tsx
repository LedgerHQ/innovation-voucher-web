import { Provider, chain, developmentChains } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";

// @dev: Strictly allow Polygon on prod, and all development chains on dev mode.
//       If we wanna support more networks, we should write an
//       utils function to manage them in a better way.
const chains = [chain.polygonMainnet];
if (process.env.NODE_ENV === "development") chains.push(...developmentChains);

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
