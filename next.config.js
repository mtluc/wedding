/** @type {import('next').NextConfig} */
const path = require("path");
const loaderUtils = require("loader-utils");

const hashOnlyIdent = (context, _, exportName) =>
  loaderUtils
    .getHashDigest(
      Buffer.from(
        `filePath:${path
          .relative(context.rootContext, context.resourcePath)
          .replace(/\\+/gi, "")}#className:${exportName}`
      ),
      "md4",
      "base64",
      6
    )
    .replace(/\//gi, "")
    .replace(/\+/gi, "")
    .replace(/^(-?\d|--)/, "_$1");

const nextConfig = {
  serverRuntimeConfig: {
    mySecret: "secret",
    cecretCookiePassword: process.env.SECRET_COOKIE_PASSWORD,
    useSessionProxy: process.env.USE_SESSION_PROXY,
    sessionTimeout: process.env.SESSION_TIME_OUT,
  },
  publicRuntimeConfig: {},
  compress: true,
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  webpack(config, { dev }) {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === "object")
      .oneOf.filter((rule) => Array.isArray(rule.use));

    if (!dev)
      rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (
            moduleLoader.loader?.includes("css-loader") &&
            !moduleLoader.loader?.includes("postcss-loader")
          )
            moduleLoader.options.modules.getLocalIdent = hashOnlyIdent;
        });
      });

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import './mtl-theme.scss';@import './variables.scss';`,
  },
  generateBuildId: async () => {
    const date = new Date();
    return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
  },
  async rewrites() {
    return [
      {
        source: "/dang-nhap",
        destination: "/login",
      },
      {
        source: "/admin/:any*",
        destination: "/admin",
      },
      {
        source: "/wedding-thumbai/:name",
        destination: "/api/bg?name=:name",
      },
      {
        source: "/api/:controler/:action",
        destination: "/api/:controler?action=:action",
      },
    ];
  },
};

module.exports = nextConfig;
