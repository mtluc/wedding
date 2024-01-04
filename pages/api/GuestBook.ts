import { DictBaseApi } from "@/base/api/dict-base-api";
import { getIronOptions } from "@/base/session";
import { GuestBook } from "@/model/GuestBook/GuestBook";
import { GuestBookBl } from "@/model/GuestBook/GuestBook.Bl";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

class Api extends DictBaseApi<GuestBookBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new GuestBookBl(GuestBook));
  }
}

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    new Api(req, res).run();
  },
  getIronOptions()
);
