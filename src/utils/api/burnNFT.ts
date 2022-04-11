const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};
const ROUTE = "api/burn";
type BurnNftType = (value: { owner: string; tokenId: string }, signature: string) => Promise<any>;

const burnNFT: BurnNftType = async (value, signature: string) => {
  try {
    const response = await fetch(ROUTE, {
      ...requestOptions,
      body: JSON.stringify({ value, signature: signature }),
    });
    return response.json();
  } catch (e) {
    throw e;
  }
};

export default burnNFT;
