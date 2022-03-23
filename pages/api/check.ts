// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { SignatureLike } from "@ethersproject/bytes"

const ethersWallet = new ethers.Wallet(process.env.LEDGER_EOA_PRIV_KEY);

const domain:TypedDataDomain = {
  name: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_NAME,
  version: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VERSION,
  chainId: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_CHAINID,
  verifyingContract: process.env.NEXT_PUBLIC_TYPEDDATADOMAIN_VOUCHER_CONTRACT,
};

const types:Record<string, Array<TypedDataField>> = {
  burn: [
    { name: "owner", type: "address" },
    { name: "tokenId", type: "uint256" },
  ],
};

export default (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== 'POST') res.status(200).json({ name: "John Doe is buying bitcoin" });

    const value = req.body.value as Record<string, any>; 
    const signature = req.body.signature as SignatureLike;
    const signer = ethers.utils.verifyTypedData(domain, types, value, signature);

    const status = value.owner.toLowerCase() === signer.toLowerCase() ? "OK" : "KO";

    console.log(`Signature ${status}`);
    res.status(200).json({signature_check: status});
};
