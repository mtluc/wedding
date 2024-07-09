// import { BaseBl } from "@/base/Bl/base-bl";
import { BaseBl } from "@/base/Bl/base-bl.mongo";
import { GuestBook } from "./GuestBook";
import { weddingDb } from "../MongoDB/weddingDbContext";

export class GuestBookBl extends BaseBl<GuestBook> {
  _tableName: string = "GuestBook";
  _idField: string = "_id";

  constructor(type: { new(): GuestBook }) {
    super(type, weddingDb);
  }

  async getItemId(id: any) {
    return await this.getById(id);
  }

  async getAll() {
    return await this.getDatas({
      UserName: this.auth?.user?.UserName,
    });
  }

  protected override async checkBusiness(
    obj: GuestBook,
    mode: "ADD" | "UPDATE" | "DELETE"
  ) {
    switch (mode) {
      case "ADD":
        if (!obj.FullName || !obj.ShortName) {
          throw {
            code: "param_invalid",
            message: "Vui lòng nhập đầy đủ thông tin",
          };
        }
        break;
      case "UPDATE":
        break;
    }
    obj.UserName = this.auth?.user?.UserName || obj.UserName;
    if (obj.GuestDate) {
      obj.GuestDate = new Date(Date.parse(obj.GuestDate?.toString()));
    }
    await super.checkBusiness(obj, mode);
  }
}
