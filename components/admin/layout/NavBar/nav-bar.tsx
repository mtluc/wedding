import { buildClass } from "@/components/Controls/mtluc/base/common";
import classNames from "./nav-bar.module.scss";
import { useAppStore } from "@/store/app-context";
import IconSvg from "@/components/Controls/mtluc/icon/icon-svg";
import { NavLink } from "react-router-dom";
const NavBar = () => {
  const ctx = useAppStore();
  return (
    <div className={classNames.wap}>
      <div className={classNames.top}>
        <div className={classNames.box_icon}>
          <IconSvg iconKeys="user" />
        </div>
        <div className={classNames.user_info}>
          <div className={classNames.title}>Xin chào</div>
          <div className={classNames.user_name}>{ctx.user?.FullName}</div>
        </div>
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
          >
            <IconSvg iconKeys="invitation" />
            <span>Thông tin thiệp cưới</span>
          </NavLink>

          <NavLink
            className={classNames.nav_item}
            to={"/admin/danh-sach-khach-moi"}
          >
            <IconSvg iconKeys="guestbook" />
            <span>Danh sách khách mời</span>
          </NavLink>

          <NavLink className={classNames.nav_item} to={"/admin/xe-dua-don"}>
            <IconSvg iconKeys="bus" />
            <span>Xe đưa đón</span>
          </NavLink>
        </div>

        <div className={classNames.group}>
          <div className={classNames.group_name}>Tài khoản</div>

          <NavLink
            className={classNames.nav_item}
            to={"/admin/thong-tin-tai-khoan"}
          >
            <IconSvg iconKeys="user" />
            <span>Thông tin tài khoản</span>
          </NavLink>

          <NavLink className={classNames.nav_item} to={"/admin/doi-mat-khau"}>
            <IconSvg iconKeys="change-password" />
            <span>Đổi mật khẩu</span>
          </NavLink>
        </div>

        {ctx.user?.UserName == "MTLUC" ? (
          <div className={classNames.group}>
            <div className={classNames.group_name}>Hệ thống</div>

            <NavLink
              className={classNames.nav_item}
              to={"/admin/danh-sach-nguoi-dung"}
            >
              <IconSvg iconKeys="user-group" />
              <span>Danh sách người dùng</span>
            </NavLink>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default NavBar;
