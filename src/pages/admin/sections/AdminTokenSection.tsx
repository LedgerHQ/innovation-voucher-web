import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { Text, Flex, Button, Input, SelectInput } from "@ledgerhq/react-ui";
import { useNetwork } from "wagmi";
import networks from "../../../utils/data/stablecoins.json";

type ShortcutButtonsType = { onClick: (string) => void; disabled: boolean; value: string };
const ShortcutButtons = ({ value, onClick, disabled }: ShortcutButtonsType) => {
  const [{ data: currentNetwork }] = useNetwork();
  const tokens = useMemo(() => {
    if (!currentNetwork.chain) return [];

    // find the tokens that match the current network and format them for the selector {label: string, value: string}
    const stablecoins = networks
      .find((network) => currentNetwork.chain?.id === network.id)
      ?.tokens.map(([label, value]) => ({ value, label }));

    // get the native token that match the current network and format it for the selector {label: string, value: string}
    const nativeToken = {
      value: ethers.constants.AddressZero,
      label: currentNetwork.chain.nativeCurrency.symbol,
    };

    const tokensToDisplay = [nativeToken];
    // stablecoins would be undefined if the user is on a network that doesn't have stablecoins defined in `stablecoins.json`
    if (stablecoins) tokensToDisplay.push(...stablecoins);

    return tokensToDisplay;
  }, [currentNetwork.chain]);

  if (!currentNetwork?.chain) return null;

  const handleChange = ({ value }) => onClick(value);

  return (
    <SelectInput
      options={tokens}
      isDisabled={disabled}
      // @ts-ignore next-line (seriously this component sucks)
      onChange={handleChange}
      defaultValue={null}
      // This is the only solution to override the component style 🤷‍♂️
      extendStyles={(styles) => ({
        ...styles,
        control: (provided) => ({ ...styles.control(provided, null), minWidth: "100px" }),
      })}
      // As we allow arbitrary value in the input, we have to set the select
      // to null each time an address typed by the user doesn't match any options
      value={tokens.find((token) => token.value === value) ?? null}
    />
  );
};

type AdminTokenSectionType = { onSave: (string) => void; value: string; disabled?: boolean };
const AdminTokenSection = ({ value, onSave, disabled = true }: AdminTokenSectionType) => {
  const [erc20addr, setErc20Addr] = useState("");
  const [error, setError] = useState("");

  // Reset the error when the input is clear
  useEffect(() => {
    // If the value of the input change, the value isn't a valid address
    // and there is a value saved in the parent then we reset the value saved in the parent
    if (value && !ethers.utils.isAddress(erc20addr)) onSave("");

    // If the last submission triggered an error, we reset it as soon as the input value change
    if (error) setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erc20addr]);

  const handleSave = (address: string) => {
    if (!ethers.utils.isAddress(address)) return setError("Incorret address!");

    // Call the callback function using the validated recipient address
    onSave(address);
    setError("");
  };

  const handleTokenClick = (address: string) => {
    // Save the value of the stablecoin in the input
    setErc20Addr(address);
    // Call the function to save the value in the parent state.
    // This is the function triggered by the "save" button
    handleSave(address);
  };

  return (
    <Flex flexDirection="column" as="section" rowGap={5} style={{ opacity: disabled ? 0.3 : 1 }}>
      <Flex flexDirection="column" as="header" rowGap={2}>
        <Text variant="h4">
          <span style={{ opacity: 0.6 }}>B/</span> Select the token
        </Text>
        <Text variant="subtitle">
          Either enter the address of the token you want, or use the selector to choose a
          pre-registered token
        </Text>
      </Flex>
      <Input
        type="text"
        placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        value={erc20addr}
        onChange={setErc20Addr}
        disabled={disabled}
        renderLeft={
          <ShortcutButtons value={value} onClick={handleTokenClick} disabled={disabled} />
        }
        renderRight={
          <Button disabled={!erc20addr} onClick={() => handleSave(erc20addr)}>
            Save
          </Button>
        }
        error={error}
        clearable
      />
    </Flex>
  );
};

export default AdminTokenSection;
