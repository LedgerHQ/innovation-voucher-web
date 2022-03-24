import api from "../../../src/utils/api";

const getAllNFTs = async ({ query: { owner }, method }, res) => {
  if (method !== "GET") return res.status(404);

  try {
    const nts = await api.getNFTs(owner);
    // @dev: set a cache of 1 day
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.status(200).json({ data: nts, error: null });
  } catch (e) {
    res.status(500).json({ data: null, error: e.message });
  }
};

export default getAllNFTs;
