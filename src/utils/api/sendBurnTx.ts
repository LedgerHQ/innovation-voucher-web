import { ethers, ContractTransaction as ContractTransactionType } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";
import contractData from "../contract.json";

type SendBurnTx = (
  signature: SignatureLike,
  owner: string,
  id: string
) => Promise<ContractTransactionType>;

// @dev: Networks are hardcoded here. If we want to support other networks, we should
//       - Add a `network` field to the `req.body` that contains the network id
//       - Write a function that checks if the network id is supported by the app
//       - Write a function that accepts chain id and returns network name according
//         to the supported networks list of the Alchemy provider
//         (https://docs.ethers.io/v5/api/providers/api-providers/#AlchemyProvider)
const network = process.env.NODE_ENV === "development" ? "kovan" : "matic";

const sendBurnTx: SendBurnTx = async (signature, owner, id) => {
  try {
    // Create a provider designed to connect to Alchemy
    const provider = new ethers.providers.AlchemyProvider(network, process.env.ALCHEMY_API_KEY);

    // Create a signer using Ledger EOA private key. Attached the provider fresly create to the signer
    // @dev: Ledger EOA private key is only accessible backend-side. Returns undefined otherwise.
    const signer = new ethers.Wallet(process.env.LEDGER_EOA_PRIV_KEY, provider);

    // Create a contract instance using the contract ABI and the signer
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
      contractData.abi,
      signer
    );

    // Send the transaction to the contract
    return contract.burnFromSignature(signature, owner, id);
  } catch (e) {
    throw e;
  }
};

export default sendBurnTx;
