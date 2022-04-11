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

function Admin() {
  const [, , isConnected] = useAccount();
  const [to, setTo] = useState([]);
  const [amount, setAmount] = useState(null);
  const [erc20Addr, setErc20Addr] = useState(null);
  const [{ loading, error, data }, mint] = useVoucherMint();

  useEffect(() => {
    // if the transaction is propagated to the network, and the state isn't already empty, we clear it
    if (data?.hash && to && amount && erc20Addr) {
      setTo([]);
      setAmount(null);
      setErc20Addr(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSubmit = async () => {
    try {
      await mint(to, amount, erc20Addr);
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
          <AdminTokenSection value={erc20Addr} disabled={!to.length} onSave={setErc20Addr} />
          <AdminAmountSection value={amount} disabled={!erc20Addr} onSave={setAmount} />
          <AdminConfirmationSection
            handleSubmit={handleSubmit}
            disabled={!(to.length && amount && erc20Addr && isConnected)}
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
