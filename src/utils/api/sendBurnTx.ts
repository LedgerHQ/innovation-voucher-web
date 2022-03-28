import { ContractTransaction as ContractTransactionType } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";
import contract from "../contract";

type SendBurnTx = (
  signature: SignatureLike,
  owner: string,
  id: string
) => Promise<ContractTransactionType>;

const sendBurnTx: SendBurnTx = async (signature, owner, id) => {
  try {
    // Send the transaction to the contract
    return contract.burnFromSignature(signature, owner, id);
  } catch (e) {
    throw e;
  }
};

export default sendBurnTx;
