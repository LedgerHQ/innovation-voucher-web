export const domain = {
  name: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_NAME,
  version: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VERSION,
  verifyingContract: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
  chainId: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_CHAINID,
};

export const types = {
  burn: [
    { name: "owner", type: "address" },
    { name: "tokenId", type: "uint256" },
  ],
};
