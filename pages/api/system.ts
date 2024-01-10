import { Auth } from "@/base/api/auth";
import { BaseApi } from "@/base/api/base-api";
import { MD5 } from "@/components/Controls/mtluc/base/common";
import { User } from "@/model/User/User";
import { UserBl } from "@/model/User/User.Bl";
import { NextApiRequest, NextApiResponse } from "next";

class Api extends BaseApi<UserBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new UserBl(User));
  }
  async login() {
    try {
      if (this.req.method == "POST") {
        const { UserName, Password } = this.body;
        if (!UserName || !Password) {
          throw {
            code: "param_invalid",
            message: "Vui lòng điền đầy đủ thông tin tài khoản và mật khẩu",
          };
        } else {
          const user = await this._bl.getById(UserName);
          if (!user || user.Password != MD5(Password)) {
            throw {
              code: "user_or_password_incorrect",
              message: "Thông tin tài khoản hoặc mật khẩu không chính xác",
            };
          } else if (!user.Actived) {
            throw {
              code: "unactived",
              message:
                "Tài khoản đã bị khóa, liên hệ <a href='tel:0986155201'>quản trị viên</a> để được kích hoạt",
            };
          } else {
            this.res.status(200).json(
              Auth.createToken({
                role: UserName == "MTLUC" || "DYLINH" ? "ADMIN" : "USER",
                tokenType: "Bearer",
                user: {
                  ...user,
                  Password: "",
                },
              })
            );
          }
        }
      } else {
        this.processMethodNotAllowed();
      }
    } catch (error) {
      this.processError(error);
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  new Api(req, res).run();
}
