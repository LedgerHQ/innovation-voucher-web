import { useState } from "react";
import Head from "next/head";
import { useContractWrite } from "wagmi";
import { utils } from "ethers";
import useAccount from "../../utils/useAccount";
import contract from "../../utils/contract.json";

const CONTRACT_DATA = {
  addressOrName: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
  contractInterface: contract.abi,
};

// TODO: Integrate UI
function Admin() {
  const [, , isConnected] = useAccount();
  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState(null);
  const [erc20Addr, setErc20Addr] = useState(null);
  const [{ data, error, loading }, write] = useContractWrite(CONTRACT_DATA, "batchMint");

  async function handleSubmit(event) {
    event.preventDefault();

    // TODO: stop JSON.parse(to)
    const parsedTo = JSON.parse(to);

    try {
      // TODO: move this at the input verification step
      if (!utils.isAddress(erc20Addr)) throw new Error("Invalid ERC20 address");

      // TODO: move this at the input verification step
      parsedTo.forEach((addr) => {
        if (utils.isAddress(addr)) return;
        throw new Error(`Invalid to address: ${addr}`);
      });

      // TODO: move this at the input verification step
      // TODO: manage 18 decimals amount correctly
      if (amount <= 0) throw new Error("Invalid amount");

      await write({ args: [parsedTo, amount, erc20Addr] });
    } catch (e) {
      throw e;
    }
  }

  return (
    <>
      <Head>
        <title>Ledger Voucher | Admin interface</title>
        <meta name="description" content="Mint new vouchers for your employees"></meta>
      </Head>
      <header>
        <h1>Mint Voucher</h1>
      </header>
      <main>
        <input
          type="text"
          placeholder="array of receiver -- stringified json"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="number"
          placeholder="amount of tokens"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
        <input
          type="text"
          placeholder="erc20 address"
          value={erc20Addr}
          onChange={(e) => setErc20Addr(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={!isConnected && !!to && !!amount && !!erc20Addr}>
          Mint
        </button>
        <p>loading: {loading}</p>
        <p>error: {error?.message}</p>
        <p>tx hash: {data?.hash}</p>
      </main>
    </>
  );
}

export default Admin;
