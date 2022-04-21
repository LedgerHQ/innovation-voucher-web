import Head from "next/head";
import { useState, useEffect } from "react";
import { Text, Flex, Button } from "@ledgerhq/react-ui";
import { useSignTypedData } from "wagmi";
import useAccount from "../utils/useAccount";
import useVoucherFetch from "../utils/useVoucherFetch";
import burnNFT from "../utils/api/burnNFT";
import { domain, types } from "../utils/EIP712";
import HomeVoucherViewerSection, { BurnedList } from "./home/sections/HomeVoucherViewerSection";

const Home = () => {
  const [tokenId, setTokenId] = useState<string>(null);
  const [txError, setTxError] = useState<Error>(null);
  const [burnedTokens, setBurnedTokens] = useState<BurnedList>([]);
  const [{ data: account }, , isConnected] = useAccount();
  const [, signTypedData] = useSignTypedData();
  const [{ data, error, loading }] = useVoucherFetch(account?.address);

  // reset the token picked by the user when the user disconnect or change account
  useEffect(() => setTokenId(null), [account?.address]);

  // prompt the provider view that asks the user to sign typed message,
  // and then fire the gasless burn function from the API
  const handleSubmit = async () => {
    const value = { owner: account.address, tokenId };

    try {
      const signature = await signTypedData({ domain, types, value });
      if (signature.error) throw signature.error;

      const tx = await burnNFT(value, signature.data);
      if (tx.error) throw error;

      // Add the token to the burned list -- go to the top of the file to know why
      setBurnedTokens((tokens) => [...tokens, value.tokenId]);
      // reset the token picked by the user
      setTokenId(null);

      // if there is an old error, clear it
      if (txError) setTxError(null);
    } catch (e) {
      console.error(e);
      setTxError(e);
    }
  };

  // save the token picked by the user, or reset it if the same token is already saved
  const handleTokenPick = (tokenId: string) => {
    setTokenId((currentTokenId) => (currentTokenId === tokenId ? null : tokenId));

    // if there is an old error, clear it
    if (txError) setTxError(null);
  };

  return (
    <>
      <Head>
        <title>Ledger Voucher | Gotta burn em all</title>
        <meta
          name="description"
          content="Got a voucher from Ledger? Burn it and becomes richer 💸"
        ></meta>
      </Head>
      <Flex flexDirection="column" rowGap={10}>
        <Flex flexDirection="column" as="header" rowGap={2}>
          <Text variant="h1">Ledger | Burn Vouchers</Text>
          <Text variant="subtitle">Got a voucher from Ledger? Burn it and becomes richer 💸</Text>
        </Flex>

        <Flex flexDirection="column" as="main" rowGap={6}>
          {isConnected ? (
            <HomeVoucherViewerSection
              loading={loading}
              error={error}
              nfts={data}
              onClick={handleTokenPick}
              currentToken={tokenId}
              burnedlist={burnedTokens}
            />
          ) : (
            <Text variant="paragraph">You must login to see your vouchers</Text>
          )}

          {data.length ? (
            <Flex alignItems="flex-start" flexDirection="column" rowGap={4}>
              <Button variant="main" outline={false} disabled={!tokenId} onClick={handleSubmit}>
                Burn {tokenId ? `#${parseInt(tokenId, 16)}` : null}
              </Button>
              {txError && (
                <Text variant="paragraph" color="error.c100">
                  {txError.message}
                </Text>
              )}
            </Flex>
          ) : null}
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
