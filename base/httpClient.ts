import {
  getLocalAuth,
  parseObjectToQueryString,
} from "@/components/Controls/mtluc/base/common";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const setAuth = (httpOption: any) => {
  if (typeof window !== 'undefined' && httpOption) {
    const auth = getLocalAuth();
    if (
      auth &&
      auth.token &&
      auth.expiredAt &&
      auth.expiredAt > new Date().getTime()
    ) {
      httpOption.headers.Authorization = `${auth.tokenType} ${auth?.token}`;
    }
  }
};

export const httpClient = {
  getUri: (url: string) => {
    if (location.origin != publicRuntimeConfig.rootApi || location.origin == 'http://localhost:3000') {
      return `/service${url.replace(/^\/api/, "")}`;
    }
    return url;
  },

  getJson: async <T>(url: string, param?: any, headers?: any) => {
    let uri = url;
    if (param) {
      let querystring = parseObjectToQueryString(param);
      if (querystring) {
        uri = `${uri}${querystring}`;
      }
    }

    const httpOption: any = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        hostname: "",
      },
    };

    if (headers) {
      httpOption.headers = {
        ...httpOption.headers,

        ...headers,
      };
    }

    setAuth(httpOption);

    const res = await fetch(uri, httpOption);
    if (res.ok) {
      return {
        statusCode: res.status,
        data: (await res.json()) as T,
      } as HttpRespon<T>;
    } else {
      await proccessError(res);
    }
  },

  postJson: async <T>(url: string, param?: any, headers?: any) => {
    let uri = url;
    let body = "";
    if (param) {
      body = JSON.stringify(param);
    }

    const httpOption: any = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        hostname: "",
      },
      body: body,
    };

    if (headers) {
      httpOption.headers = {
        ...httpOption.headers,
        ...headers,
      };
    }
    setAuth(httpOption);
    const res = await fetch(uri, httpOption);
    if (res.ok) {
      return {
        statusCode: res.status,
        data: (await res.json()) as T,
      } as HttpRespon<T>;
    } else {
      await proccessError(res);
    }
  },

  putJson: async <T>(url: string, param?: any, headers?: any) => {
    let uri = url;
    let body = "";
    if (param) {
      body = JSON.stringify(param);
    }

    const httpOption: any = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        hostname: "",
      },
      body: body,
    };

    if (headers) {
      httpOption.headers = {
        ...httpOption.headers,
        ...headers,
      };
    }

    setAuth(httpOption);
    const res = await fetch(uri, httpOption);
    if (res.ok) {
      return {
        statusCode: res.status,
        data: (await res.json()) as T,
      } as HttpRespon<T>;
    } else {
      await proccessError(res);
    }
  },

  deleteJson: async <T>(url: string, param?: any, headers?: any) => {
    let uri = url;
    if (param) {
      let querystring = parseObjectToQueryString(param);
      if (querystring) {
        uri = `${uri}${querystring}`;
      }
    }

    const httpOption: any = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        hostname: "",
      },
    };

    if (headers) {
      httpOption.headers = {
        ...httpOption.headers,
        ...headers,
      };
    }

    setAuth(httpOption);
    const res = await fetch(uri, httpOption);
    if (res.ok) {
      return {
        statusCode: res.status,
        data: (await res.json()) as T,
      } as HttpRespon<T>;
    } else {
      await proccessError(res);
    }
  },
};

export interface HttpError {
  statusCode: number;
  message: string;
  error: any;
}

export interface HttpRespon<T> {
  statusCode: number;
  data: T;
}
const getErrors = (errors: any) => {
  const result: { key: string; message: string }[] = [];
  if (errors) {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        result.push({
          key: key,
          message: errors[key],
        });
      }
    }
    return result;
  }
  return undefined;
};

const proccessError = async (res: Response) => {
  if (res.status != 404) {
    const text = await res.text();
    let error: any = "";
    try {
      error = JSON.parse(text);
    } catch (error) {
      error = text;
    }

    throw {
      statusCode: res.status,
      error: error,
      message: error.message || getErrors(error.errors)?.[0]?.message || text,
    } as HttpError;
  } else {
    throw {
      statusCode: res.status,
      error: "",
      message: "API not working",
    } as HttpError;
  }
};
