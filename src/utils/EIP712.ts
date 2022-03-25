export const domain = {
  name: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_NAME,
  version: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VERSION,
  verifyingContract: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
  // @dev: Kovan is actually hard coded here. If we wanna support other networks,
  //       we should take time to write an utils function that allow the use
  //       of major testnets and some other real networks.
  chainId:
    process.env.NODE_ENV === "development"
      ? 42 /*kovan*/
      : process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_CHAINID,
};

export const types = {
  burn: [
    { name: "owner", type: "address" },
    { name: "tokenId", type: "uint256" },
  ],
};
