import api from "../../../src/utils/api";

// TODO: Manage cache control
const getAllNFTs = async ({ query: { owner }, method }, res) => {
  if (method !== "GET") return res.status(404);

  try {
    const nts = await api.getNFTs(owner);
    res.status(200).json({ data: nts, error: null });
  } catch (e) {
    res.status(500).json({ data: null, error: e.message });
  }
};

export default getAllNFTs;
