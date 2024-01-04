import { useAppStore } from "@/store/app-context";
import classNames from "./top-bar.module.scss";
import { MouseEvent, createRef, useMemo, useRef, useState } from "react";
import IconSvg from "@/components/Controls/mtluc/icon/icon-svg";
import { DropDown } from "@/components/Controls/mtluc/Dropdown/dropdown";
import { Link, matchPath, useLocation } from "react-router-dom";
import {
  handlerRequertException,
  setAppLoading,
} from "@/components/Controls/mtluc/base/common";
import { httpClient } from "@/base/httpClient";
import { IAppRout, routers } from "@/pages/admin/router";
const TopBar = () => {
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
      await httpClient.getJson(`/api/system/logout?v=${(new Date().toJSON())}`);
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
  return (
    <div className={classNames.wap}>
      <div className={classNames.page_title}>{title}</div>
      <div className={classNames.user_box}>
        <button ref={btnUserRef} className={classNames.btn_user} type="button">
          <IconSvg className={classNames.icon_user} iconKeys="user" />
          <span className={classNames.user_name}>
            {ctx?.user?.FullName || "User name"}
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
