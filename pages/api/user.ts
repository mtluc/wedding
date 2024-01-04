import { getIronOptions } from "@/base/session";
import { DictBaseApi } from "@/base/api/dict-base-api";
import { User } from "@/model/User/User";
import { UserBl } from "@/model/User/User.Bl";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

class Api extends DictBaseApi<UserBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new UserBl(User));
  }
}

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    new Api(req, res).run();
  },
  getIronOptions()
);
