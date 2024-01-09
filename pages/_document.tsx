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
        <meta charSet="UTF-8" />
        <meta property="og:locale" content="vi_VN" />
        <meta name="robots" content="index,follow,noodp" />
        <meta name="robots" content="noarchive" />
        <meta httpEquiv="Content-Language" content="vi" />
        <meta name="robots" content="max-image-preview:large" />
        <meta name="Language" content="vi" />

        <meta property="og:title" itemProp="name" content="wedding" />

        <meta name="description" content="wedding" />

        <meta property="og:description" content="wedding" />

        <meta
          content={`/wedding-thumbai/${encodeURIComponent('Lực 123')}`}
          property="og:image"
          itemProp="thumbnailUrl"
        />

        <meta name="keywords" content="wedding|wedding online" />
        
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto"
        />
        {
          fonts.map((font) => {
            return <link
              key={font}
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css?family=${font}`}
            />
          })
        }
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
