import { Text, Flex, Link } from "@ledgerhq/react-ui";
import NextLink from "next/link";

const Terms = () => (
  <Flex flexDirection="column" rowGap="1.5rem">
    <Flex flexDirection="column" as="header" rowGap="1rem">
      <Text variant="h1">Privacy</Text>
      <Text variant="subtitle" color="neutral.c90">
        May, 2022
      </Text>
    </Flex>
    <Flex as="main" flexDirection="column" rowGap="0.75rem" style={{ maxWidth: "80ch" }}>
      <Text variant="paragraph" fontWeight="medium" fontSize="1rem">
        By adding your ETH address on your Slack profile, you consent that LEDGER collects and
        processes your data to enable you to receive rewards. Your information will be retained
        during the duration of your employment contract and will be available to the HR team and
        LEDGER’s technical service providers.
      </Text>
      <Text variant="paragraph" fontWeight="medium" fontSize="1rem">
        Your data may be transferred to countries outside the European Union, ensuring an adequate
        level of protection according to the European Commission, or within the framework of the
        standard contractual clauses adopted by the European Commission{" "}
        <Link
          href="https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en"
          type="color"
          textProps={{ fontSize: "1rem" }}
        >
          (available here)
        </Link>
        .
      </Text>
      <Text variant="paragraph" fontWeight="medium" fontSize="1rem">
        You may withdraw your consent at any time, access your data in an interoperable format and
        request their rectification or deletion. You may also request the limitation of the
        processing of your data. To make any request regarding your data or if you have any question
        pertaining to their processing, please contact LEDGER’s Data Protection Officer{" "}
        <Link href="mailto:dpo@ledger.com" type="color" textProps={{ fontSize: "1rem" }}>
          (here)
        </Link>
        .
      </Text>
      <Text variant="paragraph" fontWeight="medium" fontSize="1rem">
        If you have concerns regarding the handling of your data, you may lodge a complaint with the
        personal data protection authority of your country.
      </Text>
    </Flex>
    <NextLink href="/">
      <Text
        variant="small"
        style={{ cursor: "pointer", textDecoration: "underline" }}
        color="neutral.c70"
      >
        Back to home
      </Text>
    </NextLink>
  </Flex>
);

export default Terms;
