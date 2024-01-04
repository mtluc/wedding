import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/nav-bar";
import TopBar from "./TopBar/top-bar";
import classNames from "./layout.module.scss";
const AdminLayout = () => {
  return (
    <div className={classNames.wap}>
      <div className={classNames.nav_wap}>
        <NavBar />
      </div>
      <div className={classNames.main_wap}>
        <div className={classNames.top_bar_wap}>
          <TopBar />
        </div>
        <div className={classNames.main_box}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
