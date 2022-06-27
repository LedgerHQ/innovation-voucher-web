import Image from "next/image";
import { Nft } from "@alch/alchemy-web3";
import { Text, Flex, InfiniteLoader } from "@ledgerhq/react-ui";

const LoadingView = () => (
  <Text variant="large">
    We are fetching your vouchers
    <InfiniteLoader size={16} color="neutral.c100a07" />
  </Text>
);
const ErrorView = ({ errorMessage }: { errorMessage: string }) => (
  <Text variant="paragraph" color="error.c100">
    {errorMessage}
  </Text>
);
const EmptyView = () => <Text variant="paragraph">It seems you do not have any vouchers</Text>;

type VoucherCardType = { currentToken: string; voucher: Nft; onClick: (string) => void };
const VoucherCard = ({ currentToken, voucher, onClick }: VoucherCardType) => {
  const tokenId = voucher.id.tokenId;
  const borderColor = currentToken === tokenId ? "hsla(0, 0%, 0%, 1)" : "hsla(0, 0%, 0%, 0.2)";

  return (
    <Flex
      key={tokenId}
      onClick={() => onClick(tokenId)}
      justifyContent="center"
      alignItems="center"
      style={{
        width: "300px",
        height: "300px",
        position: "relative",
        borderRadius: "3%",
        border: `4px solid ${borderColor}`,
        overflow: "hidden",
      }}
    >
      <Image
        src="https://ledger.mypinata.cloud/ipfs/QmNwJvjVtqHDLJT81kSGzcV16JtYaBsY1wMs2tijXYcGY9"
        placeholder="blur"
        blurDataURL="data:text/plain;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
        quality={100}
        width={150}
        height={150}
        alt="ledger logo"
      />
    </Flex>
  );
};

/*
 ** This burned list is a dummy feature that has non-sense onchain but required frontend-side for UX purposes.
 ** Front-end side, user actions should have direct consequences. If the user burn a token, it shouldn't be
 ** displayed in the UI anymore, that's why we add it to the burned list to be able to filter it when displaying
 ** the voucher list in the UI.
 ** note: nothing prevent the transaction to fail on-chain, or nothing prevent the block to finally to been
 ** included in the chain. For this, we should wait n confirmations before informing the user the transaction
 ** is really included. This isn't linked to the burned list thus, it's an additionnal feature to improve the
 ** UX of this page. Off-course waiting for on-chain confirmations before deleting the token from the token
 ** list has never been an option, that would be catastrophic in terms of UX.
 */
export type BurnedList = Array<string>;
type HomeVoucherViewerSectionType = {
  loading: boolean;
  error: Error;
  onClick: (id: string) => void;
  // Voucher selected by the user
  currentToken: string;
  nfts?: Array<Nft>;
  burnedlist?: BurnedList;
};

const HomeVoucherViewerSection = ({
  loading,
  error,
  currentToken,
  onClick,
  nfts = [],
  burnedlist = [],
}: HomeVoucherViewerSectionType) => {
  if (loading) return <LoadingView />;
  if (error) return <ErrorView errorMessage={error.message} />;
  if (nfts.length === 0) return <EmptyView />;

  return (
    <Flex columnGap="12" rowGap="10" flexWrap="wrap" marginBottom="80px">
      {nfts
        .filter((voucher) => !burnedlist.find((tokenId) => tokenId === voucher.id.tokenId))
        .map((voucher) => (
          <VoucherCard
            key={voucher.id.tokenId}
            voucher={voucher}
            currentToken={currentToken}
            onClick={onClick}
          />
        ))}
    </Flex>
  );
};

export default HomeVoucherViewerSection;
