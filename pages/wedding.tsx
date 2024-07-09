/* eslint-disable @next/next/google-font-display */
import { httpClient } from "@/base/httpClient";
import { withSessionSsr } from "@/base/session";
import {
  handlerRequertException,
  parseDate,
  setAppLoading,
} from "@/components/Controls/mtluc/base/common";
import Invitation from "@/components/invitation/invitation";
import { GuestBook } from "@/model/GuestBook/GuestBook";
import { Wedding as IWedding } from "@/model/Wedding/wedding";
import getConfig from "next/config";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
const { publicRuntimeConfig } = getConfig();

export const getServerSideProps = withSessionSsr(
  async ({ req, res, query }) => {
    try {
      if (query.param) {
        const data = JSON.parse(
          decodeURIComponent(atob(query.param as string))
        ) as {
          id: string;
          user: string;
          guest: {
            Relationship: string;
            ShortName: string;
          };
        };

        return {
          props: {
            ...data,
          },
        };
      }

      return {
        redirect: {
          permanent: false,
          destination: "/error-404",
        },
        props: {},
      };
    } catch (error) {
      console.error(error);
      return {
        redirect: {
          permanent: false,
          destination: "/error-500",
        },
        props: {},
      };
    }
  }
);
export default function WeddingPage({
  id,
  user,
  guest,
}: {
  id: string;
  user: string;
  guest: {
    Relationship: string;
    ShortName: string;
  };
}) {
  const obj = {
    description: "Thiệp mời",
    title: "Thiệp mời",
  };
  const [_wedding, setWedding] = useState(undefined as any as IWedding);
  const [_guest, setGuest] = useState(undefined as any as GuestBook);

  const initData = useCallback(async () => {
    try {
      setAppLoading(true);
      if (id && user) {
        console.log(id, user);
        const res = await httpClient.getJson<{
          wedding: IWedding;
          guest: GuestBook;
        }>(`${publicRuntimeConfig.rootApi}/api/Wedding/getWeddingInfo`, {
          id,
          user,
        });

        if (res?.data) {
          if (res.data.wedding) {
            setWedding({
              ...res.data.wedding,
              PartyDate: parseDate(res.data.wedding.PartyDate),
              WeddingDate: parseDate(res.data.wedding.WeddingDate),
            });

            if (res.data.guest) {
              setGuest({
                ...res.data.guest,
                GuestDate: parseDate(res.data.guest.GuestDate),
              });
            } else {
              location.href = "/error-404";
            }
          } else {
            location.href = "/error-404";
          }
        } else {
          location.href = "/error-404";
        }
      } else {
        location.href = "/error-404";
      }
    } catch (error) {
      handlerRequertException(error);
    } finally {
      setAppLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    initData();
  }, [initData]);
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

        <meta
          property="og:image"
          content={`/service/bg?name=${encodeURIComponent(
            `${guest?.Relationship} ${guest?.ShortName}`
          )}`}
          itemProp="thumbnailUrl"
        />
        <meta
          property="og:image:secure_url"
          content={`/service/bg?name=${encodeURIComponent(
            `${_guest?.Relationship} ${guest?.ShortName}`
          )}`}
        />
        <meta property="og:image:type" content="image/png" />

        <meta name="keywords" content="wedding|wedding online" />
      </Head>
      <main>
        {_wedding && _guest ? (
          <Invitation wedding={_wedding} guest={_guest} />
        ) : null}
      </main>
    </>
  );
}
