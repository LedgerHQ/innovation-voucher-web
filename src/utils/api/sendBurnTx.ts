import { ContractTransaction as ContractTransactionType, ethers } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";
import contract from "../contract";

type SendBurnTx = (
  signature: SignatureLike,
  owner: string,
  id: string
) => Promise<ContractTransactionType>;

const estimateGas: () => Promise<{
  maxFeePerGas: ethers.BigNumber;
  maxPriorityFeePerGas: ethers.BigNumber;
}> = async () => {
  let maxFeePerGas = ethers.BigNumber.from(45000000000); // fallback to 45 gwei
  let maxPriorityFeePerGas = ethers.BigNumber.from(45000000000); // fallback to 45 gwei

  if (parseInt(process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_CHAINID) == 137) {
    const data = await (await fetch("https://gasstation-mainnet.matic.network/v2")).json();

    maxFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxFee) + "", "gwei");
    maxPriorityFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxPriorityFee) + "",
      "gwei"
    );
  }

  return { maxFeePerGas, maxPriorityFeePerGas };
};

const sendBurnTx: SendBurnTx = async (signature, owner, id) => {
  try {
    const { maxFeePerGas, maxPriorityFeePerGas } = await estimateGas();

    // Send the transaction to the contract
    return contract.burnFromSignature(signature, owner, id, {
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
  } catch (e) {
    throw e;
  }
};

export default sendBurnTx;
