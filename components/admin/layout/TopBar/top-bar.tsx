import { httpClient } from "@/base/httpClient";
import { DropDown } from "@/components/Controls/mtluc/Dropdown/dropdown";
import {
  handlerRequertException,
  setAppLoading,
} from "@/components/Controls/mtluc/base/common";
import IconSvg from "@/components/Controls/mtluc/icon/icon-svg";
import { IAppRout, routers } from "@/pages/admin/router";
import { useAppStore } from "@/store/app-context";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  createRef,
  useMemo,
} from "react";
import { matchPath, useLocation } from "react-router-dom";
import classNames from "./top-bar.module.scss";
const TopBar = ({
  setShowNav,
}: {
  setShowNav: Dispatch<SetStateAction<boolean>>;
}) => {
  const ctx = useAppStore();
  const btnUserRef = createRef<HTMLButtonElement>();
  const _location = useLocation();

  const breadCrumbItems = useMemo(() => {
    const lst: {
      text: string;
      href?: string | undefined;
      navLink?: boolean;
    }[] = [];

    if (routers?.length) {
      for (let i = 0; i < routers.length; i++) {
        lst.push(...GetBreadcrumbItems(routers[i], _location.pathname));
      }
    }
    return lst;
  }, [_location]);

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

  const title = useMemo(() => {
    for (let i = breadCrumbItems.length - 1; i >= 0; i--) {
      const item = breadCrumbItems[i];
      if (item?.text) {
        return item.text;
      }
    }
    return "";
  }, [breadCrumbItems]);

  const onShowNav = () => {
    setShowNav(true);
  };

  return (
    <div className={classNames.wap}>
      <div className={classNames.page_title}>{title}</div>
      <div className={classNames.user_box}>
        <button ref={btnUserRef} className={classNames.btn_user} type="button">
          <IconSvg className={classNames.icon_user} iconKeys="user" />
          <span className={classNames.user_name}>
            {ctx?.auth?.user?.FullName || "User name"}
          </span>
        </button>
        <DropDown parentRef={btnUserRef}>
          <div className={classNames.list_item}>
            <div className={classNames.item}>
              <a href="/admin/thong-tin-tai-khoan">
                <IconSvg iconKeys="user" />
                <span>Thông tin tài khoản</span>
              </a>
            </div>
            <div className={classNames.item}>
              <a href="/admin/doi-mat-khau">
                <IconSvg iconKeys="change-password" />
                <span>Đổi mật khẩu</span>
              </a>
            </div>
            <div className={classNames.item}>
              <a href="/admin/dang-xuat" onClick={onLogout}>
                <IconSvg iconKeys="logout" />
                <span>Đăng xuất</span>
              </a>
            </div>
          </div>
        </DropDown>
      </div>
      <button className={classNames.btnShowNav} onClick={onShowNav}>
        <IconSvg iconKeys="menu" />
      </button>
    </div>
  );
};
export default TopBar;

const GetBreadcrumbItems = (
  config: IAppRout,
  pathname: string,
  pathParent: string = "",
  parent?: IAppRout
) => {
  const result: {
    text: string;
    href?: string | undefined;
    navLink?: boolean;
  }[] = [];

  if (config) {
    if (
      matchPath(
        [pathParent, config.path, "*"].filter((x) => x).join("/"),
        pathname
      )
    ) {
      if (
        config.name &&
        ([pathParent, config.path].filter((x) => x).join("/") != pathParent ||
          (parent && !parent.name))
      ) {
        result.push({
          text: config.name,
          href: "/" + [pathParent, config.path].filter((x) => x).join("/"),
          navLink: true,
        });
      }

      if (config.childrens?.length) {
        for (let i = 0; i < config.childrens.length; i++) {
          result.push(
            ...GetBreadcrumbItems(
              config.childrens[i],
              pathname,
              [pathParent, config.path].filter((x) => x).join("/"),
              config
            )
          );
        }
      }
    }
  }

  return result;
};
