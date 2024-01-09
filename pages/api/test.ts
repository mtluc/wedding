import { MD5 } from "@/components/Controls/mtluc/base/common";
import { BaseApi } from "@/base/api/base-api";
import { User } from "@/model/User/User";
import { UserBl } from "@/model/User/User.Bl";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { decrypt, encrypt } from "@/base/encrypt";
const { serverRuntimeConfig } = getConfig();

class Api extends BaseApi<UserBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new UserBl(User));
  }

  override async get() {
    try {
      const row = await this._bl.getById("MTLUC");
      this.res.status(200).json(row);
    } catch (error) {
      this.processError(error);
    }
  }

  async getAll() {
    try {
      const row = await this._bl.getAll();
      this.res.status(200).json(row);
    } catch (error) {
      this.processError(error);
    }
  }

  async md5() {
    try {
      this.res.status(200).json(MD5(this.query.input || ""));
    } catch (error) {
      this.processError(error);
    }
  }

  async getSessionTimeout() {
    try {
      this.res.status(200).json(serverRuntimeConfig.sessionTimeout);
    } catch (error) {
      this.processError(error);
    }
  }

  async encrypt() {
    this.res.status(200).send(encrypt('MTLUC'));
  }

  async decrypt() {
    this.res.status(200).send(decrypt('677221eb1ca1ac5aa3d265a1df75210d'));
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  new Api(req, res).run();
}
