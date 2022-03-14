import { ethers } from "ethers";
import { useState } from "react";

const ethersWallet = new ethers.Wallet(process.env.NEXT_PUBLIC_USER_PRIV_KEY);

// All properties on a domain are optional
const domain = {
  name: "Ledger Voucher",
  version: "1",
  chainId: 1,
  verifyingContract: "0xd1699002d9548DCA840268ba1bd1afa27E0ba62d",
};

// The named list of all type definitions
const types = {
  RedeemInfo: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "id", type: "uint256" },
  ],
};

function Test() {
  const [voucherID, setVoucherID] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(voucherID);
    // The data to sign
    const value = {
      from: ethersWallet.address,
      to: "0xd1699002d9548DCA840268ba1bd1afa27E0ba62d",
      id: voucherID,
    };
    const signature = await ethersWallet._signTypedData(domain, types, value);
    const data = {
      domain,
      types,
      value,
      signature: signature,
    };
    fetch("api/check", {
      method: "POST",
      mode: "cors",
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
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}

export default Test;
