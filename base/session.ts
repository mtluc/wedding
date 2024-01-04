import { User } from "@/model/User/User";
import { withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import getConfig from "next/config";
import Router from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import useSWR from "swr";
const { serverRuntimeConfig } = getConfig();

export const getIronOptions = () => {
  return {
    proxy: serverRuntimeConfig.useSessionProxy,
    cookieName: "JBB_COOKIE",
    password:
      serverRuntimeConfig.cecretCookiePassword ||
      "jbb2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8jbb",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    ttl: serverRuntimeConfig.sessionTimeout || 60 * 60 * 24, //lưu cookie 1 ngày
    sameSite: "None",
    maxAge: (serverRuntimeConfig.sessionTimeout || 60 * 60 * 24) - 60,
  };
};

export interface ISession {
  isSession: boolean;
  user?: User;
  superAd?: boolean;
}

/**
 * Sử dụng cho  việc lấy session server side
 * @param fn
 * @returns
 */
export const withSessionSsr = (
  fn: (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) =>
    | GetServerSidePropsResult<{
        [key: string]: unknown;
      }>
    | Promise<
        GetServerSidePropsResult<{
          [key: string]: unknown;
        }>
      >
) => {
  return withIronSessionSsr(
    async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
      return await fn(ctx);
    },
    getIronOptions()
  );
};

/**
 * Sử dụng lấy session ở client
 * @param param0
 */
export const useSession = ({
  redirectTo = "",
  redirectIfFound = false,
} = {}) => {
  const { data: session, mutate: mutateSesion } = useSWR(
    "/api/system/getSession",
    () => {
      return fetch("/api/system/getSession").then((response) =>
        response.json()
      );
    }
  );
  useEffect(() => {
    if (!redirectTo || !session) return;

    if (redirectIfFound && (!session || !session.isSession)) {
      Router.push(redirectTo);
    }
  }, [session, redirectIfFound, redirectTo]);
  return { session: session as ISession, mutateSesion };
};
