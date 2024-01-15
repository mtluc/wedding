import { DictBaseApi } from "@/base/api/dict-base-api";
import { parseDate } from "@/components/Controls/mtluc/base/common";
import { GuestBook } from "@/model/GuestBook/GuestBook";
import { GuestBookBl } from "@/model/GuestBook/GuestBook.Bl";
import { NextApiRequest, NextApiResponse } from "next";

class Api extends DictBaseApi<GuestBookBl> {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res, new GuestBookBl(GuestBook));
  }

  async accept() {
    try {
      if (this.req.method == "PUT") {
        const { id, accept } = this.body;
        if (id && accept != undefined) {
          let guest = await this._bl.getItemId(id);
          if (guest) {
            guest = await this._bl.edit({
              ...guest,
              Agree: accept,
              GuestDate: parseDate(guest.GuestDate),
            });

            this.res.status(200).json(guest || null);
          } else {
            throw {
              code: "record_not_exists",
              message: "Khách mời không tồn tại!",
            };
          }
        } else {
          throw {
            code: "invalid_param",
            message: "Tham số không hợp lệ!",
          };
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
