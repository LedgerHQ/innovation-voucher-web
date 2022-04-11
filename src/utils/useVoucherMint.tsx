import { useMemo } from "react";
import { useContractWrite } from "wagmi";
import type { ethers } from "ethers";
import contract from "./data/contract.json";

const CONTRACT_DATA = {
  addressOrName: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
  contractInterface: contract.abi,
};

type UseVoucherMintType = () => [
  { loading: boolean; error?: Error; data: any },
  (
    to: Array<string>,
    amount: string,
    erc20Addr: string
  ) => Promise<
    | {
        data: ethers.providers.TransactionResponse;
        error: undefined;
      }
    | {
        data: undefined;
        error: Error;
      }
  >
];

const useVoucherMint: UseVoucherMintType = () => {
  // setup the batchmint function in the case of the voucher would be send to multiple recipients
  const [batchMintState, batchMint] = useContractWrite(CONTRACT_DATA, "batchMint");
  // setup the mint function in the case of the voucher would be send to only one recipient
  const [mintState, singleMint] = useContractWrite(CONTRACT_DATA, "mint");
  // as the two functions will never be used in the same time, we can aggregate the two states
  const state = useMemo(
    () => ({
      data: batchMintState?.data || mintState?.data,
      error: batchMintState?.error || mintState?.error,
      loading: batchMintState?.loading || mintState?.loading,
    }),
    [batchMintState, mintState]
  );

  const mint = (to: Array<string>, amount: string, erc20Addr: string) => {
    if (to.length > 1) return batchMint({ args: [to, amount, erc20Addr] });
    return singleMint({ args: [to[0], amount, erc20Addr] });
  };

  return [state, mint];
};

export default useVoucherMint;
