import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { Text, Flex, Button, InfiniteLoader, Link } from "@ledgerhq/react-ui";
import getHashPreview from "../../../utils/getHashPreview";

type AdminConfirmationSectionType = {
  handleSubmit: () => void;
  disabled: boolean;
  loading?: boolean;
  error?: Error;
  hash?: string; // Represent the transaction hash
};

const errorMapping = (error) => {
  if (error.message.includes("Ownable: caller is not the owner")) {
    return new Error("You don't have the permission to mint tokens");
  }
  return error;
};

const AdminConfirmationSection = ({
  handleSubmit,
  disabled,
  loading,
  error,
  hash,
}: AdminConfirmationSectionType) => {
  const [{ data: currentNetwork }] = useNetwork();
  const formatedError = useMemo(() => (error ? errorMapping(error) : null), [error]);

  return (
    <Flex
      flexDirection="row-reverse"
      justifyContent="space-between"
      alignItems="flex-end"
      as="section"
    >
      <Button variant="main" onClick={handleSubmit} disabled={disabled}>
        <Flex alignContent="center" columnGap={3}>
          Mint {loading ? <InfiniteLoader size={12} color="background.main" /> : null}
        </Flex>
      </Button>
      {formatedError ? (
        <Text variant="paragraph" color="error.c100">
          {formatedError.message}
        </Text>
      ) : null}
      {hash ? (
        <Link href={`${currentNetwork?.chain?.blockExplorers[0]?.url}/tx/${hash}`} target="_blank">
          <Flex flexDirection="column" alignItems="flex-start">
            <Text color="primary.c100">Success 🎉</Text>
            <Text color="primary.c100">See the transaction ({getHashPreview(hash)})</Text>
          </Flex>
        </Link>
      ) : null}
    </Flex>
  );
};

export default AdminConfirmationSection;
