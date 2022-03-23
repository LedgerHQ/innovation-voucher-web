import dynamic from "next/dynamic";
import { useState } from "react";
import { ethers } from "ethers";
import useAccount from "../src/utils/useAccount";
import { domain, types } from "../src/utils/EIP712";

// @dev: Import the component client-side only (no SSR because metamask requires window)
const Connector = dynamic(() => import("../src/components/Connector"), {
  ssr: false,
});
// TODO: remove me to use signed message function from wagmi
const ethersWallet = new ethers.Wallet(process.env.NEXT_PUBLIC_USER_PRIV_KEY);

function Test() {
  const [voucherID, setVoucherID] = useState("");
  const [{ data: account }] = useAccount();

  async function handleSubmit(event) {
    event.preventDefault();

    // The data to sign
    const value = { owner: account.address, tokenId: voucherID };

    // TODO: use signed message function from wagmi
    const signature = await ethersWallet._signTypedData(domain, types, value);
    const data = { value, signature };
    fetch("api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.text();
    console.log(res);
  }

  return (
    <div className="Example">
      <Connector />
      <h1>Redeem Voucher</h1>
      <div>
        <p>Account is {account?.address}</p>
        <form onSubmit={handleSubmit}>
          <label>
            Enter voucher ID to redeem:
            <input
              type="number"
              value={voucherID}
              onChange={(e) => setVoucherID(e.target.value)}
            />
          </label>
          <input type="submit" disabled={!voucherID} />
        </form>
      </div>
    </div>
  );
}

export default Test;
