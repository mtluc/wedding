import { ISession, getIronOptions } from "@/base/session";
import { MD5 } from "@/components/Controls/mtluc/base/common";
import { BaseApi } from "@/base/api/base-api";
import { User } from "@/model/User/User";
import { UserBl } from "@/model/User/User.Bl";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

class Api extends BaseApi<UserBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new UserBl(User));
  }

  async getSession() {
    try {
      if (this.req.method == "GET") {
        const session = this.req.session as any as ISession;
        if (this.req.session) {
          this.res.json({
            ...session,
            user: session.user,
            isSession: session.isSession ? true : false,
          } as ISession);
        } else {
          this.res.json({
            isSession: false,
          } as ISession);
        }
      } else {
        this.processMethodNotAllowed();
      }
    } catch (error) {
      this.processError(error);
    }
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
            (this.req.session as any as ISession) = {
              ...this.req.session,
              isSession: true,
              user: { ...user, Password: "" },
            };
            await this.req.session.save();
            this.res.status(200).json({ ...user, Password: undefined });
          }
        }
      } else {
        this.processMethodNotAllowed();
      }
    } catch (error) {
      this.processError(error);
    }
  }
  async logout() {
    try {
      await this.req.session.destroy();
      this.res.status(200).json(true);
    } catch (error) {
      this.processError(error);
    }
  }
}

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    new Api(req, res).run();
  },
  getIronOptions()
);
