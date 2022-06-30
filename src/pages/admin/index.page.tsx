import { useEffect, useState } from "react";
import Head from "next/head";
import { Text, Flex } from "@ledgerhq/react-ui";
import useAccount from "../../utils/useAccount";
import useVoucherMint from "../../utils/useVoucherMint";
import {
  AdminRecipientSection,
  AdminTokenSection,
  AdminAmountSection,
  AdminConfirmationSection,
} from "./sections";

type Token = { ticker: string; address: string; decimals: number };
function Admin() {
  const [, , isConnected] = useAccount();
  const [to, setTo] = useState([]);
  const [amount, setAmount] = useState(null);
  const [erc20, setERC20] = useState<Token | null>(null);

  const [{ loading, error, data }, mint] = useVoucherMint();

  useEffect(() => {
    // if the transaction is propagated to the network, and the state isn't already empty, we clear it
    if (data?.hash && to && amount && erc20?.address) {
      setTo([]);
      setAmount(null);
      setERC20(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSubmit = async () => {
    try {
      await mint(to, amount, erc20.address);
    } catch (e) {
      throw e;
    }
  };

  // Ensure the new recipient isn't already in the list then add it
  const handleToSave = (recipient) =>
    setTo((previousTo) => [...new Set([...previousTo, recipient])]);

  // Remove the selected address from the list
  const handleToRemove = (recipient) =>
    setTo((previousTo) => previousTo.filter((addr) => addr !== recipient));

  const handleERC20Save = (erc20: Token) => {
    setERC20(erc20);
    // reset amount input on ERC20 save
    setAmount(null);
  };

  return (
    <>
      <Head>
        <title>Ledger Voucher | Admin interface</title>
        <meta name="description" content="Mint new vouchers for your employees"></meta>
      </Head>
      <Flex flexDirection="column" rowGap={10}>
        <Flex flexDirection="column" as="header" rowGap={2}>
          <Text variant="h1">Ledger | Mint Vouchers</Text>
          <Text variant="subtitle">
            By using this interface, you can mint vouchers for Ledger employees.
          </Text>
        </Flex>

        <Flex flexDirection="column" as="main" rowGap={14} style={{ maxWidth: "40rem" }}>
          <AdminRecipientSection recipients={to} onSave={handleToSave} onRemove={handleToRemove} />
          <AdminTokenSection value={erc20} disabled={!to.length} onSave={handleERC20Save} />
          <AdminAmountSection
            value={amount}
            decimals={erc20?.decimals}
            disabled={!erc20?.address}
            onSave={setAmount}
          />
          <AdminConfirmationSection
            handleSubmit={handleSubmit}
            disabled={!(to.length && amount && erc20?.address && isConnected)}
            loading={loading}
            error={error}
            hash={data?.hash}
          />
        </Flex>
      </Flex>
    </>
  );
}

export default Admin;
