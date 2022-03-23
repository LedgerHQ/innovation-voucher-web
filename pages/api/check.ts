import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";
import { domain, types } from "../../src/utils/EIP712";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: { value: Record<string, any>; signature: SignatureLike };
}
type Response = { ok: true; error: null } | { ok: false; error: string };

export default (
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Response>
) => {
  if (req.method !== "POST") return res.status(404);
  const { value, signature } = req.body;
  // check if value and signature are provided
  if (!(value && signature)) return res.status(422);

  try {
    const signer = ethers.utils.verifyTypedData(
      domain,
      types,
      value,
      signature
    );

    if (value.owner.toLowerCase() !== signer.toLowerCase())
      return res
        .status(401)
        .send({ ok: false, error: "owner doesn't match the signer" });

    res.status(200).json({ ok: true, error: null });
  } catch (e) {
    res.status(500).json({ ok: false, error: "failed to verify data" });
  }
};
