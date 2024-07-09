/* eslint-disable @next/next/google-font-display */
import { fonts } from "@/components/invitation/font";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi-VN">
      <Head>
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css?family=Roboto|${fonts.join(
            "|"
          )}`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
