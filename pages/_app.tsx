import DiaLogManager from "@/components/Controls/mtluc/DialogManager/dialog-manager";
import Loading from "@/components/Controls/mtluc/Loading/loading";
import NotificationManager from "@/components/Controls/mtluc/NotificationManager/notification-manager";
import "@/styles/globals.scss";
import { useMemo } from "react";
import "../components/Controls/mtluc/mtl.control.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }: any) {
  const component = useMemo(() => {
    return <Component {...pageProps} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageProps]);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
      </Head>
      {component}
      <Loading
        isLoading={false}
        isFix={true}
        subcriberSetApploading={(e) => {
          if (!global.app) {
            global.app = {};
          }
          global.app.setAppLoading = e;
        }}
      />

      <DiaLogManager
        subcriberPushDialog={(e) => {
          if (!global.app) {
            global.app = {};
          }
          global.app.pushDialog = e;
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          height: 0,
          zIndex: 10001,
          textAlign: "center",
        }}
      >
        <NotificationManager
          subcriberPushNotification={(e) => {
            if (!global.app) {
              global.app = {};
            }
            global.app.pushNotification = e;
          }}
        />
      </div>
    </>
  );
}
export default MyApp;
