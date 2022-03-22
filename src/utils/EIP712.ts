export const domain = {
  name: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_NAME,
  version: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VERSION,
  chainId: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_CHAINID,
  verifyingContract: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
};

export const types = {
  burn: [
    { name: "owner", type: "address" },
    { name: "tokenId", type: "uint256" },
  ],
};
