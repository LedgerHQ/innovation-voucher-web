import { Nft } from "@alch/alchemy-web3";

const network = process.env.NODE_ENV === "development" ? "polygon-mumbai" : "polygon-mainnet";
const baseUrl = `https://${network}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}/getNFTs/`;
// @dev: The request is filtered using the smart contract address
const endpoint = `${baseUrl}?withMetadata=true&contractAddresses[]=${process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT}`;

type FetchNFTs = (owner: string, nfts?: Array<Nft>, pageKey?: string) => Promise<Nft[]>;
type JSONResponse = { ownedNfts: Array<Nft>; pageKey: string };

const getNFTs: FetchNFTs = async (owner, nfts = [], pageKey = null) => {
  // @dev: the API crashes if we pass an pageKey equals to 0 or null, only use this param if needed
  const pageKeyParam = pageKey ? `&pageKey=${pageKey}` : "";
  const response = await fetch(`${endpoint}&owner=${owner}${pageKeyParam}`);

  const data: JSONResponse = await response.json();
  const ownedNFTs = [...nfts, ...data.ownedNfts];
  /*
   ** @dev: pageKey is non-null if there are more pages to fetch
   ** That's why this function is a recursive function, we continue to
   ** call it until we have all the NFTs owned by the owner
   */
  return data.pageKey ? await getNFTs(owner, ownedNFTs, data.pageKey) : ownedNFTs;
};

export default getNFTs;
