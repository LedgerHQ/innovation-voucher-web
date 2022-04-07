import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Nft } from "@alch/alchemy-web3";
import { useSignTypedData } from "wagmi";
import useAccount from "../utils/useAccount";
import { domain, types } from "../utils/EIP712";

// @dev: Import the component client-side only (no SSR because metamask requires window)
const Connector = dynamic(() => import("../components/Connector"), {
  ssr: false,
});

function Test() {
  const [tokenId, setTokenId] = useState(null);
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

      const response = await fetch("api/burn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value, signature: signature.data }),
      });

      const data = await response.json();
      // TODO: Display status in the UI
      console.log(data);
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
        <p>Account: {account?.address}</p>
        <p>Token chosen: {tokenId}</p>
        <button onClick={handleSubmit} disabled={!tokenId}>
          Burn and redeem
        </button>

        {!!nfts?.length && (
          <ul>
            {nfts.map((nft) => (
              <li onClick={() => setTokenId(nft.id.tokenId)} key={nft.id.tokenId}>
                id: {nft.id.tokenId}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default Test;
