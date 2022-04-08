import { Flex } from "@ledgerhq/react-ui";
import dynamic from "next/dynamic";

// @dev: Import the component client-side only (no SSR -- metamask requires window)
const Connector = dynamic(() => import("../components/Connector"), { ssr: false });

const Header = () => (
  <Flex justifyContent="flex-end">
    <Connector />
  </Flex>
);

export default Header;
