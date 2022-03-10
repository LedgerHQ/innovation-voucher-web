import { ethers } from "ethers";

const ethersWallet = new ethers.Wallet("0xdeadbeef");

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

async function handleClick() {
  // The data to sign
  const value = {
    from: ethersWallet.address,
    to: "0xd1699002d9548DCA840268ba1bd1afa27E0ba62d",
    id: 123456789,
  };
  const signature = await ethersWallet._signTypedData(domain, types, value);
  const data = {
    domain,
    types,
    value,
    signature: signature,
  };
  fetch("http://localhost:3000/api/check", {
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

function Test() {
  return (
    <div className="Example">
      <h1>Redeem Voucher</h1>
      <div>
        <p>Account is {ethersWallet.address}</p>
        <button onClick={handleClick}>Sign</button>
      </div>
    </div>
  );
}

export default Test;
