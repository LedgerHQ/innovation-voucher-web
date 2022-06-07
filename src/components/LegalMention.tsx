import { memo } from "react";
import styled from "styled-components";
import { Text, Link } from "@ledgerhq/react-ui";

const Paragraph = styled(Text).attrs({
  variant: "small",
  textAlign: "right",
  fontSize: "12px",
})`
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const LegalMention = memo(() => (
  <Paragraph>
    LEDGER collects your personal data in order to enable you to receive rewards.{" "}
    <Link href="/terms">
      <Text color="primary.c100" variant="small" style={{ cursor: "pointer" }}>
        Learn more about how we manage your data and your rights
      </Text>
    </Link>
  </Paragraph>
));

LegalMention.displayName = "LegalMention";

export default LegalMention;
