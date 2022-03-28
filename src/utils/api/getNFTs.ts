import { Nft as NftType } from "@alch/alchemy-web3";

// @dev: The request is filtered using our smart contract address
const params = `withMetadata=true&contractAddresses[]=${process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT}`;
const endpoint = `${process.env.ALCHEMY_ENDPOINT}/getNFTs/?${params}`;

type FetchNFTs = (owner: string, nfts?: Array<NftType>, pageKey?: string) => Promise<NftType[]>;
type JSONResponse = { ownedNfts: Array<NftType>; pageKey: string };

const getNFTs: FetchNFTs = async (owner, nfts = [], pageKey = null) => {
  // @dev: the API crashes if we pass an pageKey equals to 0 or null, only use this param if needed
  const pageKeyParam = pageKey ? `&pageKey=${pageKey}` : "";
  const response = await fetch(`${endpoint}&owner=${owner}${pageKeyParam}`);

  const data: JSONResponse = await response.json();
  const ownedNFTs = [...nfts, ...data.ownedNfts];
  // @dev: Each request returns up to 100 NFTs. pageKey is non-null if there
  //       are more pages to fetch. That's why this function is a recursive function,
  //       we continue to call it until we have all the NFTs owned by the owner
  return data.pageKey ? await getNFTs(owner, ownedNFTs, data.pageKey) : ownedNFTs;
};

export default getNFTs;
