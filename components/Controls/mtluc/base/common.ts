import { KeyboardEvent, MutableRefObject, useEffect } from "react";

/**
 * Kiểm tra email có hợp lệ không
 * @param email email cần kiểm tra
 */
export const checkEmailTemplate = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
};

/**
 * Kiểm tra số điện thoại có hợp lệ không
 * @param phone số điện thoại cần kiểm tra
 */
export const checkPhoneTemplate = (phone: string) => {
  return (
    /^(\(\+[0-9]{1,3}\)[0-9]{9})$/.test(phone) ||
    /^(\+[0-9]{1,3}[0-9]{9})$/.test(phone) ||
    /^[0-9]{10}$/.test(phone)
  );
};

export const buildClass = (classNames: (string | undefined)[]) => {
  return (
    classNames
      .filter((x) => x)
      ?.join(" ")
      ?.trim() || ""
  );
};

export const createMethodClickOutSide = (
  ref: any,
  onClickOutSide: Function
) => {
  return (e: any) => {
    if (ref?.current && !ref?.current.contains(e.target)) {
      onClickOutSide(e);
    }
  };
};

export const getPositionElementInWindow = (el: HTMLElement) => {
  const bon = el.getBoundingClientRect();
  return {
    x: bon.left, // + window.screenX,
    y: bon.top, // + window.screenY,
    width: bon.width,
    height: bon.height,
  };
};

export const getSelection = (el: HTMLInputElement) => {
  return {
    start: el.selectionStart || 0,
    end: el.selectionEnd || 0,
  };
};

export const formatDate = (v: Date, format: string = "dd/mm/yyyy") => {
  let value = format;
  if (v) {
    //#region  year
    value = value.replace(/yyyy/g, v.getFullYear().toString());
    value = value.replace(/yy/g, (v.getFullYear() % 1000).toString());
    //#endregion

    //#region  month
    value = value.replace(
      /mm/g,
      v.getMonth() + 1 < 10
        ? "0" + (v.getMonth() + 1).toString()
        : (v.getMonth() + 1).toString()
    );
    //#endregion

    //#region day
    value = value.replace(
      /dd/g,
      v.getDate() < 10 ? "0" + v.getDate().toString() : v.getDate().toString()
    );
    //#endregion

    //#region house
    value = value.replace(
      /HH/g,
      v.getHours() < 10
        ? "0" + v.getHours().toString()
        : v.getHours().toString()
    );
    //#endregion

    //#region minute
    value = value.replace(
      /MM/g,
      v.getMinutes() < 10
        ? "0" + v.getMinutes().toString()
        : v.getMinutes().toString()
    );
    //#endregion

    //#region Second
    value = value.replace(
      /ss/g,
      v.getSeconds() < 10
        ? "0" + v.getSeconds().toString()
        : v.getSeconds().toString()
    );
    //#endregion
  }

  return value;
};

/**
 * Hàm format định dạng số
 * @param number
 * @param digit
 * @param locales
 * @returns
 */
export const formatNumber = (
  number: number,
  digit: number = 2,
  locales: string = "vi-VN"
) => {
  return roundNumber(number || 0, digit).toLocaleString(locales, {
    minimumFractionDigits: digit,
  });
};

export const newGuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const pushNotification = ({
  message,
  type,
  intervalClose,
  onClose,
}: {
  message?: string;
  type?: "primary" | "secondary" | "success" | "danger" | "warning";
  intervalClose?: number;
  onClose?: () => void;
}) => {
  globalThis?.app?.pushNotification?.(
    message,
    type,
    intervalClose == undefined ? 2000 : intervalClose,
    onClose
  );
};

export const roundNumber = (x: number, digit: number) => {
  return Number.parseFloat(x.toFixed(digit));
};

export const pushDialog = ({
  title,
  content,
  type,
  preventAction,
  width,
}: {
  title?: string;
  content?: any;
  type?: "noti" | "error" | "question";
  preventAction?: (type: "close" | "accept" | "cancel") => Promise<boolean>;
  width?: number;
}) => {
  return new Promise<"close" | "accept" | "cancel">((resolve, reject) => {
    globalThis?.app?.pushDialog?.(
      title,
      content,
      type,
      preventAction,
      (type: "close" | "accept" | "cancel") => {
        resolve(type);
      },
      width
    );
  });
};

export const handlerRequertException = async (ex: any) => {
  console.error(ex);
  const result = await pushDialog({
    type: "error",
    content: ex.message || ex,
  });

  if (result == "cancel" || result == "close") {
    if (ex.statusCode == 401) {
      if (location.pathname.indexOf("/admin/") === 0) {
        location.href = "/admin/login";
      } else {
        location.href =
          "/khach-hang/dang-nhap?forward=" +
          encodeURIComponent(location.href.replace(location.origin, ""));
      }
    }
  }
  return result;
};

export const showDevelopMessage = () => {
  handlerRequertException({
    message: "Chức năng đang trong quá trình phát triển.",
  });
};

export const setAppLoading = (isLoading: boolean) => {
  globalThis?.app?.setAppLoading?.(isLoading);
};

/**
 * chuyển object sang querystring
 * @param obj
 * @returns
 */
export const parseObjectToQueryString = (obj: any) => {
  let queryString = Object.keys(JSON.parse(JSON.stringify(obj)))
    ?.map((key) => `${key}=${encodeURIComponent(obj[key])}`)
    ?.join("&");
  if (queryString) {
    return "?" + queryString;
  }
  return queryString;
};

export const getUrlInfo = (url?: string) => {
  if (!url) url = location.href;
  const objUrl = new URL(url);
  let queryStrings: any = {};
  if (objUrl?.search) {
    var query = objUrl.search.substr(1);
    query.split("&").forEach(function (part) {
      var item = part.split("=");
      queryStrings[item[0]] = decodeURIComponent(item[1]);
    });
  }
  return {
    hash: objUrl.hash,
    host: objUrl.host,
    hostname: objUrl.hostname,
    href: objUrl.href,
    origin: objUrl.origin,
    password: objUrl.password,
    pathname: objUrl.pathname,
    port: objUrl.port,
    protocol: objUrl.protocol,
    search: objUrl.search,
    username: objUrl.username,
    queryStrings: queryStrings,
  };
};

export const HandleClickOutSide = (
  ref: MutableRefObject<any>,
  onClickOutSide: Function
) => {
  useEffect(() => {
    function _handleClickOutside(event: Event) {
      if (ref?.current && !ref?.current.contains(event.target)) {
        onClickOutSide(event);
      }
    }
    document.addEventListener("mousedown", _handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", _handleClickOutside);
    };
  }, [ref, onClickOutSide]);
};

export const compareShortDate = (v1?: Date, v2?: Date) => {
  let _v1 = v1
    ? new Date(v1.getFullYear(), v1.getMonth() - 1, v1.getDate())
    : 0;
  let _v2 = v2
    ? new Date(v2.getFullYear(), v2.getMonth() - 1, v2.getDate())
    : 0;
  if (_v1 > _v2) {
    return 1;
  } else if (_v1 < _v2) {
    return -1;
  }
  return 0;
};

/**
 * add day
 * @param date
 * @param daynumber
 * @returns
 */
export const addDay = (date: Date, daynumber: number) => {
  return date
    ? new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + daynumber,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    : null;
};

/**
 * Mã hóa md5
 */
export const MD5 = (input: string) => {
  var md5 = require("md5");
  return md5(input);
};

export const parseDate = (input: any) => {
  if (typeof input == "number") {
    return new Date(input);
  } else {
    return new Date(Date.parse(input));
  }
};

export const handlerDocumentKeyDown = (fn: (e: KeyboardEvent) => void) => {
  const oldEvent = document.onkeydown;
  document.onkeydown = function (_e: any) {
    fn(_e);
  };

  return () => {
    document.onkeydown = oldEvent;
  };
};

export const fireMouseDown = (
  el: HTMLElement | Document = document
) => {
  let event = document.createEvent("MouseEvent");
  event.initEvent("mousedown", true, true);
  el.dispatchEvent(event);
};
