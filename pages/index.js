import { ethers } from "ethers";
import { useState } from "react";

const ethersWallet = new ethers.Wallet(process.env.NEXT_PUBLIC_USER_PRIV_KEY);

const domain = {
  name: "Ledger Voucher",
  version: "1",
  chainId: 1,
  verifyingContract: process.env.NEXT_PUBLIC_VOUCHER_CONTRACT,
};

const types = {
  RedeemData: [
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
      signature: signature,
    };
    fetch("api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      const data = await response.text();
      console.log(data);
    });
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
