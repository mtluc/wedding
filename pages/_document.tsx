/* eslint-disable @next/next/google-font-display */
import { fonts } from "@/components/invitation/font";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi-VN">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css?family=Roboto|${fonts.join('|')}`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
