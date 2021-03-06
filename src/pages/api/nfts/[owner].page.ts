import api from "../../../utils/api";

const getAllNFTs = async ({ query: { owner }, method }, res) => {
  if (method !== "GET") return res.status(404);

  try {
    const nfts = await api.getNFTs(owner);
    // @dev: set a cache of 1 day in production
    if (process.env.VERCEL_ENV === "production") res.setHeader("Cache-Control", "s-maxage=600");
    res.status(200).json({ data: nfts, error: null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ data: null, error: e.message });
  }
};

export default getAllNFTs;
