import dynamic from "next/dynamic";
import { useState } from "react";
import useAccount from "../src/utils/useAccount";
import { domain, types } from "../src/utils/EIP712";
import { useSignTypedData } from "wagmi";

// @dev: Import the component client-side only (no SSR because metamask requires window)
const Connector = dynamic(() => import("../src/components/Connector"), {
  ssr: false,
});

function Test() {
  const [tokenId, setTokenId] = useState("");
  const [{ data: account }] = useAccount();
  const [, signTypedData] = useSignTypedData();

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
              <input
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </label>
            <input type="submit" disabled={!tokenId} />
          </form>
        </section>
      </main>
    </>
  );
}

export default Test;
