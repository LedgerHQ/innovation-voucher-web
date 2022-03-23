import { ethers } from "ethers";
import { useState } from "react";

const ethersWallet = new ethers.Wallet(process.env.NEXT_PUBLIC_USER_PRIV_KEY);

const domain = {
  name: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_NAME,
  version: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VERSION,
  chainId: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_CHAINID,
  verifyingContract: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
};

const types = {
  burnWithSignature: [
    { name: "owner", type: "address" },
    { name: "id", type: "uint256" },
  ],
};

function Test() {
  const [voucherID, setVoucherID] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    // The data to sign
    const value = {
      owner: ethersWallet.address,
      id: voucherID,
    };
    const signature = await ethersWallet._signTypedData(domain, types, value);
    const data = {
      value,
      signature,
    };
    const response = await fetch("api/check", {
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
      <h1>Redeem Voucher</h1>
      <div>
        <p>Account is {ethersWallet.address}</p>
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
