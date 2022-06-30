import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Text, Flex, Input } from "@ledgerhq/react-ui";

type AdminAmountSectionType = {
  value: string;
  decimals: number;
  onSave: (string) => void;
  disabled: boolean;
};
const AdminAmountSection = ({ value, decimals, onSave, disabled }: AdminAmountSectionType) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset the input everytime the user update the token
    if (!value && amount.length > 0) setAmount("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    // If there is no value in the input because user cleared the input
    // or set "0" as the value, we clear the value saved in the parent
    // if needed otherwise we stop the function
    if (!amount || amount === "0") return value ? onSave("") : null;

    try {
      // parseEther() triggers a error if the amount passed to the function is incorrect
      const parsedAmount = ethers.utils.parseUnits(amount, decimals).toString();
      onSave(parsedAmount);

      // reset error if the formattedValue is correct
      setError("");
    } catch (e) {
      // Happens if the amount passed to parseEther() is incorrect
      setError("Incorrect amount!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  return (
    <Flex flexDirection="column" as="section" rowGap={5} style={{ opacity: disabled ? 0.3 : 1 }}>
      <Flex flexDirection="column" as="header" rowGap={2}>
        <Text variant="h4">
          <span style={{ opacity: 0.6 }}>C/</span> Select the amount
        </Text>
        <Text variant="subtitle">
          This is the amount of token that will be linked to the voucher. Employees can get them
          back by burning the voucher.
        </Text>
      </Flex>
      <Input
        type="number"
        placeholder="50"
        value={amount}
        onChange={setAmount}
        error={error}
        disabled={disabled}
        min="0"
        clearable
      />
    </Flex>
  );
};

export default AdminAmountSection;
