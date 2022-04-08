import { useConnect } from "wagmi";
import { useMemo } from "react";
import { Flex, Button, Text } from "@ledgerhq/react-ui";
import Image from "next/image";
import type { Connector as WAGMIConnect } from "wagmi-core";
import useAccount from "../utils/useAccount";

type ConnectorButtonProps = { connector?: WAGMIConnect; onClick: () => void };
const ConnectorButton = ({ connector, onClick }: ConnectorButtonProps) => {
  if (!connector) return null;

  return (
    <Button
      variant="shade"
      outline={false}
      onClick={onClick}
      fontSize={3}
      style={{ padding: "0.75rem", borderRadius: "50%" }}
    >
      <Image
        src={`/connectors/${connector.name}.svg`}
        alt={connector.name}
        width={24}
        height={24}
      />
    </Button>
  );
};

const DisconnectButton = ({ address, onClick }: { address: string; onClick: () => void }) => {
  // Get the first 4 characters of the address and the last 4 characters
  const [start, end] = useMemo(
    () => [address.substring(0, 4), address.substring(address.length - 4, address.length)],
    [address]
  );

  return (
    <Button variant="shade" outline={false} onClick={onClick} fontSize={3}>
      Disconnect{" "}
      <Text variant="small" fontWeight="light">
        ({`${start}...${end}`})
      </Text>
    </Button>
  );
};

const Connector = () => {
  const [{ data }, connect] = useConnect();
  const [{ data: account }, disconnect, isConnected] = useAccount();

  // Render null if the connectors are loading
  if (!data.connectors.length) return null;

  // Connect the connector
  const handleClick = (connectorId: string) => {
    connect(data.connectors.find((connector) => connector.id === connectorId));
  };

  // Render the disconnect button if needed
  if (isConnected) return <DisconnectButton address={account.address} onClick={disconnect} />;

  // Render the list of connectors available
  return (
    <Flex columnGap={2}>
      {data.connectors.map((connector) => (
        <ConnectorButton
          key={connector.id}
          connector={connector}
          onClick={() => handleClick(connector.id)}
        />
      ))}
    </Flex>
  );
};

export default Connector;
