import type { NextApiRequest, NextApiResponse } from "next";
import { ethers, ContractTransaction } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";
import { domain, types } from "../../utils/EIP712";
import api from "../../utils/api";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: { value: { owner: string; tokenId: string }; signature: SignatureLike };
}
type BurnAPIResponse =
  | { ok: true; error: null; data: ContractTransaction }
  | { ok: false; error: string; data: null };

// @dev: check if the signature is valid
//       If the signature is correct, the function returns nothing
//       If not, the request is rejected (status code 401 or 500)
const checkSignature: (
  { value, signature }: ExtendedNextApiRequest["body"],
  res: NextApiResponse<BurnAPIResponse>
) => void = ({ value, signature }, res) => {
  try {
    const signer = ethers.utils.verifyTypedData(domain, types, value, signature);

    // @dev: return 401 HTTP status code if the signer is not the owner of the token
    //       otherwise return nothing and continue the request processing
    if (value.owner.toLowerCase() !== signer.toLowerCase())
      return res
        .status(401)
        .send({ ok: false, error: "owner doesn't match the signer", data: null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "failed to verify data", data: null });
  }
};

// @dev: try to send the transaction to the smart contract
//       If the transaction is send, the function returns the transaction struct from ethers
//       If not, the request is rejected (status code 500)
const sendBurnTx: (
  { value, signature }: ExtendedNextApiRequest["body"],
  res: NextApiResponse<BurnAPIResponse>
) => Promise<ContractTransaction | void> = async ({ value, signature }, res) => {
  try {
    return api.sendBurnTx(signature, value.owner, value.tokenId);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ ok: false, error: "failed to build the transaction", data: null });
  }
};

const route = async (req: ExtendedNextApiRequest, res: NextApiResponse<BurnAPIResponse>) => {
  try {
    if (req.method !== "POST") return res.status(404);

    // check if the value and the signature are provided. If not, return 422 HTTP status code
    if (!(req.body.value && req.body.signature)) return res.status(422);

    // check if the signature is correct. If not, the request is rejected.
    checkSignature(req.body, res);

    // interact with the contract by calling the `burnFromSignature` function using Ledger EOA
    // @dev: ContractTransaction is casted because TS doesn't understand tx can't be void type
    const tx = (await sendBurnTx(req.body, res)) as ContractTransaction;

    // if everything is okay, return the transaction struct from Alchemy
    res.status(200).json({ ok: true, error: null, data: tx });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message, data: null });
  }
};

export default route;
