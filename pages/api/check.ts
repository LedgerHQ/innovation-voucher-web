// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { SignatureLike } from "@ethersproject/bytes"

import * as params from "./private_key.js";  

const ethersWallet = new ethers.Wallet(params.privKey);

export default (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    
    const domain = req.body.domain as TypedDataDomain;
    const types = req.body.types as Record<string, Array<TypedDataField>>;
    const value = req.body.value as Record<string, any>; 
    const signature = req.body.signature as SignatureLike;

    const signer = ethers.utils.verifyTypedData(domain, types, value, signature);
    if (value.from === signer) {
      console.log("Signature OK");
    }
    res.status(200).json({signature_check: "OK"});
  } else {
    res.status(200).json({ name: "John Doe" });
  }  
};
