import type { AppProps } from "next/app";
import WAGMIProvider from "../utils/WAGMIProvider";
import { StyleProvider } from "@ledgerhq/react-ui";
import "../../public/style.css";

/*
 ** Next.js uses the App component to initialize pages. You can override it and control the page initialization.
 ** We need it to inject our providers on each pages.
 */
const CustomApp = ({ Component, pageProps }: AppProps) => (
  <StyleProvider selectedPalette="dark" fontsPath="/fonts">
    <WAGMIProvider>
      <Component {...pageProps} />
    </WAGMIProvider>
  </StyleProvider>
);

export default CustomApp;
