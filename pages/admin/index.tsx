import { IAuth } from "@/base/api/auth";
import { getLocalAuth } from "@/components/Controls/mtluc/base/common";
import AppContext from "@/store/app-context";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { genRouter, routers } from "./router";

const AdminPage: NextPage = () => {
  const [auth, setAuthen] = useState(getLocalAuth() || ({} as IAuth));
  const [isRender, setIsRender] = useState(false);
  useEffect(() => {
    setIsRender(true);
  }, []);
  return (
    <AppContext.Provider
      value={{
        auth: auth,
        setAuth: setAuthen,
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
