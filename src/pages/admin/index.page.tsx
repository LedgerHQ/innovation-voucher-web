import { useState } from "react";
import Head from "next/head";
import { useContractWrite } from "wagmi";
import useAccount from "../../utils/useAccount";
import contract from "../../utils/data/contract.json";
import { Text, Flex, Button } from "@ledgerhq/react-ui";
import AdminRecipientSection from "./sections/AdminRecipientSection";
import AdminTokenSection from "./sections/AdminTokenSection";
import AdminAmountSection from "./sections/AdminAmountSection";

const CONTRACT_DATA = {
  addressOrName: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
  contractInterface: contract.abi,
};

function Admin() {
  const [, , isConnected] = useAccount();
  const [to, setTo] = useState([]);
  const [amount, setAmount] = useState(null);
  const [erc20Addr, setErc20Addr] = useState(null);
  // TODO: Display tx error
  // TODO: Display tx link
  const [, write] = useContractWrite(CONTRACT_DATA, "batchMint");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await write({ args: [to, amount, erc20Addr] });
    } catch (e) {
      throw e;
    }
  }

  // Ensure the new recipient isn't already in the list then add it
  const handleToSave = (recipient) =>
    setTo((previousTo) => [...new Set([...previousTo, recipient])]);

  // Remove the selected address from the list
  const handleRemove = (recipient) =>
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
            Using this interface, you can mint vouchers for Ledger employees.
          </Text>
        </Flex>

        <Flex flexDirection="column" as="main" rowGap={10} style={{ maxWidth: "40rem" }}>
          <AdminRecipientSection recipients={to} onSave={handleToSave} onRemove={handleRemove} />
          <AdminTokenSection value={erc20Addr} disabled={!to.length} onSave={setErc20Addr} />
          <AdminAmountSection value={amount} disabled={!erc20Addr} onSave={setAmount} />

          <Flex justifyContent="flex-end" as="section">
            <Button
              variant="main"
              onClick={handleSubmit}
              disabled={!(to.length && amount && erc20Addr && isConnected)}
            >
              Mint
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default Admin;
