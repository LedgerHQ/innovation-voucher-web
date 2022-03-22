import { useMemo } from "react";
import { useConnect } from "wagmi";
import useAccount from "../utils/useAccount";

const Connector = () => {
  const [{ data, error }, connect] = useConnect();
  const [, disconnect, isConnected] = useAccount();
  const connector = useMemo(
    () => (data?.connectors.length ? data.connectors[0] : null),
    [data.connectors]
  );

  const handleClick = () => (isConnected ? disconnect() : connect(connector));

  if (!connector) return null;

  return (
    <div>
      <button
        disabled={!connector.ready}
        key={connector.id}
        onClick={handleClick}
      >
        {isConnected ? "Disconnect" : "Connect wallet"}
      </button>
      {error && <div>{error?.message ?? "Failed to connect"}</div>}
    </div>
  );
};

export default Connector;
