import DiaLogManager from '@/components/Controls/mtluc/DialogManager/dialog-manager';
import Loading from '@/components/Controls/mtluc/Loading/loading';
import NotificationManager from '@/components/Controls/mtluc/NotificationManager/notification-manager';
import '@/styles/globals.scss';
import { useMemo } from 'react';
import "../Components/Controls/mtluc/mtl.control.scss";

function MyApp({ Component, pageProps }: any) {
  const component = useMemo(() => {
    return <Component {...pageProps} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageProps]);
  return (
    <>
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