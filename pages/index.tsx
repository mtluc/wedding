/* eslint-disable @next/next/google-font-display */
import { withSessionSsr } from "@/base/session";
import Invitation from "@/components/invitation/invitation";
import Head from "next/head";

export const getServerSideProps = withSessionSsr(
  async ({ req, res, query }) => {
    return {
      props: {
        query: query || {},
      },
    };
  }
);
export default function Home({ query }: { query: { name: string } }) {
  const obj = {
    description: "Thiệp mời online",
    title: "Thiệp mời online",
  };
  return (
    <>
      <Head>
        <title>{obj.title}</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta property="og:locale" content="vi_VN" />
        <meta name="robots" content="index,follow,noodp" />
        <meta name="robots" content="noarchive" />
        <meta httpEquiv="Content-Language" content="vi" />
        <meta name="robots" content="max-image-preview:large" />
        <meta name="Language" content="vi" />

        <meta property="og:title" itemProp="name" content={obj.title} />
        <meta name="description" content={obj.description} />
        <meta property="og:description" content={obj.description} />

        <meta property="og:url" content="https://mtluc.id.vn" />
        <link rel="canonical" href={`https://mtluc.id.vn`} />

        <meta property="og:image" content={`/service/wedding-thumbai/${encodeURIComponent(query.name || "")}`} itemProp="thumbnailUrl"/>
        <meta
          property="og:image:secure_url"
          content={`/wedding-thumbai/${encodeURIComponent(query.name || "")}`}
        />
        <meta property="og:image:type" content="image/png" />

        <meta name="keywords" content="wedding|wedding online" />
      </Head>
      <main>
        <Invitation />
      </main>
    </>
  );
}
