import { User } from "@/model/User/User";
import { decrypt, encrypt } from "../encrypt";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export const Auth = {
  createToken: (param: IAuthData) => {
    if (!param.expiredAt) {
      param.expiredAt =
        new Date().getTime() + serverRuntimeConfig.tokenExpire * 60 * 1000;
    }
    return {
      token: encrypt(JSON.stringify(param)),
      tokenType: param.tokenType,
      expiredAt: param.expiredAt,
      role: param.role,
      user: param.user,
    } as IAuth;
  },

  getToken: (auth: string) => {
    if (auth) {
      const [tokenType, token] = auth.trim().split(" ");
      const data = decrypt(token);

      if (data) {
        let authData: IAuthData | null = null;
        try {
          authData = JSON.parse(data);
        } catch {}

        if (authData) {
          if (tokenType?.toLowerCase() == authData.tokenType?.toLowerCase()) {
            if (
              authData.expiredAt &&
              authData.expiredAt > new Date().getTime()
            ) {
              return authData;
            }
          }
        }
      }
    }

    throw {
      code: "unauth",
      message: `Phiên làm việc hết hạn`,
    };
  },
};

export interface IAuth {
  tokenType?: string;
  token?: string;
  expiredAt?: number;
  user?: User;
  role?: "ADMIN" | "MANAGER" | "USER";
}

export interface IAuthData {
  tokenType?: string;
  role?: "ADMIN" | "MANAGER" | "USER";
  user?: User;
  expiredAt?: number;
}
