import EmptyRow from "@/components/Controls/mtluc/EmptyRow/empty-row";
import AdminLayout from "@/components/admin/layout/layout";
import { useAppStore } from "@/store/app-context";
import { Suspense, lazy } from "react";
import { Route } from "react-router-dom";

export const routers: IAppRout[] = [
  {
    path: "admin",
    element: <AdminLayout />,
    checkAuthen: true,
    childrens: [
      {
        path: "",
        name: "Tổng quan",
        element: <EmptyRow title="Trống" />,
      },
      {
        path: "thong-tin-le-cuoi",
        name: "Thông tin lễ cưới",
        elementLazy: lazy(
          () => import("./../../components/admin/wedding/wedding")
        ),
      },
      {
        path: "danh-sach-khach-moi",
        name: "Danh sách khách mời",
        elementLazy: lazy(
          () =>
            import(
              "./../../components/admin/guest-book/guest-book-list/guest-book.list"
            )
        ),
      },
      {
        path: "xe-dua-don",
        name: "Xe đưa đón",
        element: <EmptyRow title="Trống" />,
      },
      {
        path: "thong-tin-tai-khoan",
        name: "Thông tin tài khoản",
        element: <EmptyRow title="Trống" />,
      },
      {
        path: "doi-mat-khau",
        name: "Đổi mật khẩu",
        element: <EmptyRow title="Trống" />,
      },
      {
        path: "danh-sach-nguoi-dung",
        name: "Danh sách người dùng",
        elementLazy: lazy(
          () => import("./../../components/admin/users/user-list/user-list")
        ),
      },
    ],
  },
  {
    path: ":any/*",
    elementLazy: lazy(() => import("./Error/error")),
  },
];

export interface IAppRout {
  path: string;
  name?: string;
  element?: JSX.Element;
  elementLazy?: React.LazyExoticComponent<any> | any;
  childrens?: IAppRout[];
  checkAuthen?: boolean;
  checkAd?: boolean;
}

export const genRouter = (route: IAppRout) => {
  if (route.childrens?.length) {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          route.checkAuthen ? (
            <ProtectedAuth>{route.element}</ProtectedAuth>
          ) : (
            route.element
          )
        }
        // eslint-disable-next-line react/no-children-prop
        children={route.childrens.map((route) => {
          return genRouter(route);
        })}
      />
    );
  } else {
    if (route.elementLazy) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.checkAuthen ? (
              <ProtectedAuth>
                <Suspense fallback={<>...</>}>
                  <route.elementLazy />
                </Suspense>
              </ProtectedAuth>
            ) : (
              <Suspense fallback={<>...</>}>
                <route.elementLazy />
              </Suspense>
            )
          }
        />
      );
    } else {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.checkAuthen ? (
              <ProtectedAuth>{route.element}</ProtectedAuth>
            ) : (
              route.element
            )
          }
        />
      );
    }
  }
};

const ProtectedAuth = ({
  children,
  checkAd,
}: {
  children: React.ReactNode;
  checkAd?: boolean;
}) => {
  const ctx = useAppStore();
  if (
    !ctx.auth ||
    !ctx.auth.expiredAt ||
    ctx.auth.expiredAt < new Date().getTime() ||
    !ctx.auth.user?.UserName ||
    (checkAd && ctx?.auth?.role != "ADMIN")
  ) {
    location.href =
      "/dang-nhap?forward=" +
      encodeURIComponent(location.href.replace(location.origin, ""));
    return <></>;
  }
  return <>{children}</>;
};

const AppRout = () => {
  return <></>;
};
export default AppRout;
