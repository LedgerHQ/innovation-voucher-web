import { useMemo } from "react";
import { ethers } from "ethers";
import { Text, Flex, Input, SelectInput } from "@ledgerhq/react-ui";
import { useNetwork } from "wagmi";
import networks from "../../../utils/data/stablecoins.json";

type Token = { ticker: string; address: string; decimals: number };
type ShortcutButtonsType = { onClick: (string) => void; disabled: boolean; value: Token };
const ShortcutButtons = ({ value, onClick, disabled }: ShortcutButtonsType) => {
  const [{ data: currentNetwork }] = useNetwork();
  const tokens = useMemo(() => {
    if (!currentNetwork.chain) return [];

    // find the tokens that match the current network and format them for the selector {label: string, value: string}
    const stablecoins = networks
      .find((network) => currentNetwork.chain?.id === network.id)
      ?.tokens.map(({ ticker, address, decimals }) => ({
        value: { ticker, address, decimals },
        label: ticker,
      }));

    // get the native token that match the current network and format it for the selector {label: string, value: string}
    const nativeToken = {
      value: {
        ticker: currentNetwork.chain.nativeCurrency.symbol,
        address: ethers.constants.AddressZero,
        decimals: 18,
      },
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
      value={tokens.find((token) => token?.label === value?.ticker) ?? null}
    />
  );
};

type AdminTokenSectionType = {
  onSave: (string) => void;
  value: Token | null;
  disabled?: boolean;
};
const AdminTokenSection = ({ value: token, onSave, disabled = true }: AdminTokenSectionType) => (
  <Flex flexDirection="column" as="section" rowGap={5} style={{ opacity: disabled ? 0.3 : 1 }}>
    <Flex flexDirection="column" as="header" rowGap={2}>
      <Text variant="h4">
        <span style={{ opacity: 0.6 }}>B/</span> Select the token
      </Text>
      <Text variant="subtitle">Use the selector to choose a pre-registered token</Text>
    </Flex>
    <Input
      type="text"
      placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
      value={token?.address ?? ""}
      disabled={disabled}
      renderLeft={<ShortcutButtons value={token} onClick={onSave} disabled={disabled} />}
    />
  </Flex>
);

export default AdminTokenSection;
