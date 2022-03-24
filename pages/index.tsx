import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Nft } from "@alch/alchemy-web3";
import { useSignTypedData } from "wagmi";
import useAccount from "../src/utils/useAccount";
import { domain, types } from "../src/utils/EIP712";

// @dev: Import the component client-side only (no SSR because metamask requires window)
const Connector = dynamic(() => import("../src/components/Connector"), {
  ssr: false,
});

function Test() {
  const [tokenId, setTokenId] = useState("");
  const [nfts, setNFTs] = useState<Array<Nft>>([]);
  const [{ data: account }] = useAccount();
  const [, signTypedData] = useSignTypedData();

  const fetchNFTs = async (address: string) => {
    try {
      const response = await fetch(`api/nfts/${address}`);
      const nfts = await response.json();
      setNFTs(nfts.data);
    } catch (e) {
      // TODO: Display the error in the UI
      console.error(e);
    }
  };

  useEffect(() => {
    if (!account?.address) return;

    // dev: Run the function once per address change
    fetchNFTs(account?.address);
  }, [account?.address]);

  async function handleSubmit(event) {
    event.preventDefault();

    const value = { owner: account.address, tokenId };

    try {
      const signature = await signTypedData({ domain, types, value });

      if (signature.error) throw signature.error;

      const response = await fetch("api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value, signature: signature.data }),
      });

      const data = await response.json();
      // TODO: Display status in the UI
      console.log(data.ok);
    } catch (e) {
      throw e;
    }
  }

  return (
    <>
      <Head>
        <title>Ledger Voucher</title>
        <meta name="description" content="Got a ticket from Ledger? Redeem it!"></meta>
      </Head>
      <header>
        <h1>Redeem Voucher</h1>
        <Connector />
      </header>
      <main>
        <section>
          <p>Account is {account?.address}</p>
          <form onSubmit={handleSubmit}>
            <label>
              Enter voucher ID to redeem:
              <input type="number" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
            </label>
            <input type="submit" disabled={!tokenId} />
          </form>
        </section>
        {!!nfts?.length && (
          <section>
            <ul>
              {nfts.map((nft) => (
                <li key={nft.id.tokenId}>id: {nft.id.tokenId}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

export default Test;
