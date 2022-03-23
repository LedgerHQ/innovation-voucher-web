import { useConnect } from "wagmi";
import useAccount from "../utils/useAccount";

const Connector = () => {
  const [{ data }, connect] = useConnect();
  const [, disconnect, isConnected] = useAccount();

  // Render null if the connectors are loading
  if (!data?.connectors.length) return null;

  // Render the button to disconnected if needed
  if (isConnected)
    return (
      <section>
        <button onClick={disconnect}>{`Disconnect ${data?.connector?.name}`}</button>
      </section>
    );

  // Render all the connector buttons
  return (
    <section>
      {data.connectors.map((connector) => (
        <button disabled={!connector.ready} key={connector.id} onClick={() => connect(connector)}>
          {`Connect using ${connector.name}`}
        </button>
      ))}
    </section>
  );
};

export default Connector;
