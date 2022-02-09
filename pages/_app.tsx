import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "antd/dist/antd.css";
import { Main } from "../components";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Main>
        <Component {...pageProps} />
      </Main>
    </SessionProvider>
  );
}

export default MyApp;
