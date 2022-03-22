import type { AppProps } from "next/app";
import WAGMIProvider from "../src/utils/WAGMIProvider";

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <WAGMIProvider>
    <Component {...pageProps} />
  </WAGMIProvider>
);

export default CustomApp;
