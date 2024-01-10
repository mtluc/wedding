import { DictBaseApi } from "@/base/api/dict-base-api";
import { GuestBook } from "@/model/GuestBook/GuestBook";
import { GuestBookBl } from "@/model/GuestBook/GuestBook.Bl";
import { NextApiRequest, NextApiResponse } from "next";

class Api extends DictBaseApi<GuestBookBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new GuestBookBl(GuestBook));
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  new Api(req, res).run();
}
