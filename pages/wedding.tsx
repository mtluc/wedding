/* eslint-disable @next/next/no-img-element */
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
        //id,user,Relationship,ShortName
        const datas = (decodeURIComponent(atob(query.param as string)) || "")
          .split('","')
          .map((x) => x.replaceAll('""', '"'));

        return {
          props: {
            id: datas[0],
            user: datas[1],
            guest: {
              Relationship: datas[2],
              ShortName: datas[3],
            },
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
        const res = await httpClient.getJson<{
          wedding: IWedding;
          guest: GuestBook;
        }>(`/api/Wedding/getWeddingInfo`, {
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

        <meta property="og:url" content={publicRuntimeConfig.rootApi} />
        <link rel="canonical" href={publicRuntimeConfig.rootApi} />

        <meta
          property="og:image"
          content={`/api/bg?name=${encodeURIComponent(
            `${guest?.Relationship} ${guest?.ShortName}`
          )}`}
          itemProp="thumbnailUrl"
        />
        <meta
          property="og:image:secure_url"
          content={`/api/bg?name=${encodeURIComponent(
            `${guest?.Relationship} ${guest?.ShortName}`
          )}`}
        />
        <meta property="og:image:type" content="image/png" />

        <meta name="keywords" content="wedding|wedding online" />
      </Head>
      <main>
        <div
          style={{
            position: "fixed",
            width: 0,
            height: 0,
            overflow: "hidden",
            zIndex: -1,
          }}
        >
          <img src="/images/background/bg1.png" alt="" hidden />
          <img src="/images/background/bg.jpg" alt="" hidden />
          <img src="/images/background/bca.png" alt="" hidden />
          <img src="/images/background/mail.png" alt="" hidden />
          <img src="/images/icon/heart.png" alt="" hidden />
        </div>

        {_wedding && _guest ? (
          <Invitation wedding={_wedding} guest={_guest} />
        ) : null}
      </main>
    </>
  );
}
