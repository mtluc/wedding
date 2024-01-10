import {
  buildClass,
  handlerRequertException,
  setAppLoading,
} from "@/components/Controls/mtluc/base/common";
import IconSvg from "@/components/Controls/mtluc/icon/icon-svg";
import { useAppStore } from "@/store/app-context";
import { Dispatch, MouseEvent, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import classNames from "./nav-bar.module.scss";
const NavBar = ({
  setShowNav,
}: {
  setShowNav: Dispatch<SetStateAction<boolean>>;
}) => {
  const ctx = useAppStore();

  const onLogout = async (e: MouseEvent) => {
    try {
      e.preventDefault();
      setAppLoading(true);
      localStorage.clear();
      location.href = "/dang-nhap";
    } catch (error) {
      handlerRequertException(error);
    } finally {
      setAppLoading(false);
    }
  };

  const onHideNav = () => {
    setShowNav(false);
  };

  return (
    <div className={classNames.wap}>
      <div className={classNames.top}>
        <div className={classNames.box_icon}>
          <IconSvg iconKeys="user" />
        </div>
        <div className={classNames.user_info}>
          <div className={classNames.title}>Xin chào</div>
          <div className={classNames.user_name}>{ctx.auth?.user?.FullName}</div>
        </div>
        <button className={classNames.btn_close_nav} onClick={onHideNav}>
          <IconSvg iconKeys="close" />
        </button>
      </div>
      <div className={buildClass(["custom-scroll", classNames.main])}>
        <div className={classNames.group}>
          <NavLink
            className={({ isActive }) => {
              return buildClass([
                classNames.nav_item,
                isActive && location.pathname == "/admin" ? "active" : "",
              ]);
            }}
            to={"/admin"}
            onClick={onHideNav}
          >
            <IconSvg iconKeys="home" />
            <span>Tổng quan</span>
          </NavLink>
        </div>

        <div className={classNames.group}>
          <div className={classNames.group_name}>Thiệp & khách mời</div>

          <NavLink
            className={classNames.nav_item}
            to={"/admin/thong-tin-thiep-cuoi"}
            onClick={onHideNav}
          >
            <IconSvg iconKeys="invitation" />
            <span>Thông tin thiệp cưới</span>
          </NavLink>

          <NavLink
            className={classNames.nav_item}
            to={"/admin/danh-sach-khach-moi"}
            onClick={onHideNav}
          >
            <IconSvg iconKeys="guestbook" />
            <span>Danh sách khách mời</span>
          </NavLink>

          <NavLink
            className={classNames.nav_item}
            to={"/admin/xe-dua-don"}
            onClick={onHideNav}
          >
            <IconSvg iconKeys="bus" />
            <span>Xe đưa đón</span>
          </NavLink>
        </div>

        <div className={classNames.group}>
          <div className={classNames.group_name}>Tài khoản</div>

          <NavLink
            className={classNames.nav_item}
            to={"/admin/thong-tin-tai-khoan"}
            onClick={onHideNav}
          >
            <IconSvg iconKeys="user" />
            <span>Thông tin tài khoản</span>
          </NavLink>

          <NavLink
            className={classNames.nav_item}
            to={"/admin/doi-mat-khau"}
            onClick={onHideNav}
          >
            <IconSvg iconKeys="change-password" />
            <span>Đổi mật khẩu</span>
          </NavLink>
        </div>

        {ctx.auth?.role == "ADMIN" ? (
          <div className={classNames.group}>
            <div className={classNames.group_name}>Hệ thống</div>

            <NavLink
              className={classNames.nav_item}
              to={"/admin/danh-sach-nguoi-dung"}
              onClick={onHideNav}
            >
              <IconSvg iconKeys="user-group" />
              <span>Danh sách người dùng</span>
            </NavLink>
          </div>
        ) : null}
      </div>
      <div className={classNames.bottom}>
        <button onClick={onLogout}>
          <IconSvg iconKeys="logout" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};
export default NavBar;
