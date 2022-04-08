import { useState, useEffect, memo } from "react";
import { ethers } from "ethers";
import { Text, Flex, Button, Input, Icons } from "@ledgerhq/react-ui";
import getRandomColorPerAddress from "../../../utils/getRandomColorPerAddress";

type RecipientLineType = { address: string; onClick: () => void; index: number };
const RecipientLine = memo(({ address, onClick, index }: RecipientLineType) => (
  <Flex key={address} columnGap={3} alignItems="center">
    <Flex
      justifyContent="center"
      alignItems="center"
      bg={getRandomColorPerAddress(address)}
      size="0.75rem"
      p={3}
    >
      <Text variant="paragraph" color="white" fontSize={2}>
        {index}
      </Text>
    </Flex>
    <Text variant="paragraph" width="40ch">
      {address}
    </Text>
    <Button onClick={onClick} Icon={Icons.CircledCrossSolidMedium} />
  </Flex>
));
// memo() removes the displayName of the component, that's why we set it manually
RecipientLine.displayName = "RecipientLine";

type AdminRecipientSectionType = {
  onSave: (string) => void;
  onRemove: (string) => void;
  recipients: Array<string>;
};
// TODO: Support ENS
const AdminRecipientSection = ({ onSave, onRemove, recipients }: AdminRecipientSectionType) => {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset the error when the input is clear
    if (recipient.length === 0) setError("");
  }, [recipient]);

  const handleSave = () => {
    if (!ethers.utils.isAddress(recipient)) return setError("Incorret address!");
    if (recipient === ethers.constants.AddressZero) return setError("Incorret address!");

    // Call the callback function using the validated recipient address
    onSave(recipient);

    // Reset the input
    setRecipient("");
  };

  return (
    <Flex flexDirection="column" as="section" rowGap={5}>
      <Flex flexDirection="column" as="header" rowGap={2}>
        <Text variant="h4">
          <span style={{ opacity: 0.6 }}>A/</span> Select the recipients
        </Text>
        <Text variant="subtitle">
          All the addresses you are going to add here will receive the same voucher.
        </Text>
      </Flex>
      <Input
        type="text"
        placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        value={recipient}
        onChange={setRecipient}
        renderRight={
          <Button disabled={!recipient} onClick={handleSave}>
            Add
          </Button>
        }
        error={error}
        clearable
      />
      {recipients.length ? (
        <Flex ml={7} flexDirection="column" rowGap={1}>
          {recipients.map((recipient, index) => (
            <RecipientLine
              key={recipient}
              address={recipient}
              index={index + 1}
              onClick={() => onRemove(recipient)}
            />
          ))}
        </Flex>
      ) : null}
    </Flex>
  );
};

export default AdminRecipientSection;
