import { useState } from "react";
import Head from "next/head";
import { useContractWrite } from "wagmi";
import { utils } from "ethers";
import useAccount from "../../utils/useAccount";
import contract from "../../utils/contract.json";
import { Text, Flex, Button } from "@ledgerhq/react-ui";
import AdminRecipientSection from "./sections/AdminRecipientSection";

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
      // TODO: move this at the input verification step
      if (!utils.isAddress(erc20Addr)) throw new Error("Invalid ERC20 address");

      // TODO: move this at the input verification step
      // TODO: manage 18 decimals amount correctly
      if (amount <= 0) throw new Error("Invalid amount");

      await write({ args: [to, amount, erc20Addr] });
    } catch (e) {
      throw e;
    }
  }

  const handleToSave = (recipient) => {
    // Ensure the new recipient isn't already in the list then add it
    setTo((previousTo) => [...new Set([...previousTo, recipient])]);
  };

  const handleRemove = (recipient) => {
    // Remove selected address from the list
    setTo((previousTo) => previousTo.filter((addr) => addr !== recipient));
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
            Using this interface, you can mint vouchers for Ledger employees.
          </Text>
        </Flex>

        <Flex flexDirection="column" as="main" rowGap={10} style={{ maxWidth: "35rem" }}>
          <AdminRecipientSection recipients={to} onSave={handleToSave} onRemove={handleRemove} />

          <Flex flexDirection="column" as="section" style={{ opacity: to.length ? 1 : 0.3 }}>
            <Text variant="h4">
              <span style={{ opacity: 0.6 }}>2/</span> Select the token
            </Text>
            <input
              type="text"
              placeholder="erc20 address"
              value={erc20Addr}
              onChange={(e) => setErc20Addr(e.target.value)}
              disabled={!to.length}
            />
          </Flex>

          <Flex flexDirection="column" as="section" style={{ opacity: erc20Addr ? 1 : 0.3 }}>
            <Text variant="h4">
              <span style={{ opacity: 0.6 }}>3/</span> Select the amount
            </Text>
            <input
              type="number"
              placeholder="amount of tokens"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              disabled={!erc20Addr}
            />
          </Flex>

          <Flex justifyContent="flex-end" as="section">
            <Button
              variant="main"
              onClick={handleSubmit}
              disabled={(!to.length && !amount && !erc20Addr) || !isConnected}
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
