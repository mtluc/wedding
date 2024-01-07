import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/nav-bar";
import TopBar from "./TopBar/top-bar";
import classNames from "./layout.module.scss";
import { useState } from "react";
import { buildClass } from "@/components/Controls/mtluc/base/common";
const AdminLayout = () => {
  const [showNavMobile, setShowNavMobi] = useState(false);
  return (
    <div className={classNames.wap}>
      <div
        className={buildClass([
          classNames.nav_wap,
          !showNavMobile ? classNames.hide_nav_mobile : "",
        ])}
      >
        <NavBar setShowNav={setShowNavMobi} />
      </div>
      <div className={classNames.main_wap}>
        <div className={classNames.top_bar_wap}>
          <TopBar setShowNav={setShowNavMobi} />
        </div>
        <div className={classNames.main_box}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
