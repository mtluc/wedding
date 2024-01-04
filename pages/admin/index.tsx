import { ISession, withSessionSsr } from "@/base/session";
import { User } from "@/model/User/User";
import AppContext from "@/store/app-context";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { genRouter, routers } from "./router";

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  const session = req.session as any as ISession;

  return {
    props: {
      session: session,
    },
  };
});

const AdminPage: NextPage = (props: { session?: ISession }) => {
  const [user, setUser] = useState(props.session?.user as User);
  const [isRender, setIsRender] = useState(false);
  useEffect(() => {
    setIsRender(true);
  }, []);
  return (
    <AppContext.Provider
      value={{
        user: user,
        setUser: setUser,
        isSession: user?.UserName ? true : false,
      }}
    >
      {isRender ? (
        <BrowserRouter>
          <Routes>
            {routers.map((route) => {
              return genRouter(route);
            })}
          </Routes>
        </BrowserRouter>
      ) : null}
    </AppContext.Provider>
  );
};
export default AdminPage;
