import type { AppProps } from "next/app";
import WAGMIProvider from "../utils/WAGMIProvider";
import { Flex, StyleProvider } from "@ledgerhq/react-ui";
import Header from "../components/Header";

/*
 ** Next.js uses the App component to initialize pages. You can override it and control the page initialization.
 ** We need it to inject our providers on each pages.
 */
const CustomApp = ({ Component, pageProps }: AppProps) => (
  <StyleProvider selectedPalette="light" fontsPath="/fonts">
    <WAGMIProvider>
      <Flex flexDirection="column" rowGap={4} px={8} py={4}>
        <Header />
        <Component {...pageProps} />
      </Flex>
    </WAGMIProvider>
  </StyleProvider>
);

export default CustomApp;
