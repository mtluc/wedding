import { DictBaseApi } from "@/base/api/dict-base-api";
import { GuestBook } from "@/model/GuestBook/GuestBook";
import { GuestBookBl } from "@/model/GuestBook/GuestBook.Bl";
import { Wedding } from "@/model/Wedding/wedding";
import { WeddingBl } from "@/model/Wedding/wedding.Bl";
import { NextApiRequest, NextApiResponse } from "next";

class Api extends DictBaseApi<WeddingBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new WeddingBl(Wedding));
  }

  public async GetByIdOrDefault() {
    try {
      this.checkAuth();
      const data = await this._bl.getById(this.auth.user?.UserName || "");
      this.res.status(200).json(data || new Wedding());
    } catch (error) {
      this.processError(error);
    }
  }

  public async getWeddingInfo() {
    try {
      if (this.query.id && this.query.user) {
        const [wedding, guest] = await Promise.all([
          this._bl.getById(this.query.user),
          new GuestBookBl(GuestBook).getItemId(this.query.id),
        ]);
        this.res.status(200).json({
          wedding,
          guest,
        });
      } else {
        this.res.status(200).json(null);
      }
    } catch (error) {
      this.processError(error);
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  new Api(req, res).run();
}
