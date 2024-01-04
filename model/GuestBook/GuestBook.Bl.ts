import { BaseBl } from "../../base/Bl/base-bl";
import { GuestBook } from "./GuestBook";

export class GuestBookBl extends BaseBl<GuestBook> {
  _tableName: string = "GuestBook";
  _idField: string = "Id";

  override async getById(id: any) {
    return await this.dbContext.get<GuestBook>(
      `SELECT * FROM ${this._tableName} WHERE ${this._idField} = ? AND UserName = ?;`,
      [id, this.session?.user?.UserName]
    );
  }

  override async getAll() {
    return await this.dbContext.getAll<GuestBook>(
      `SELECT * FROM ${this._tableName} WHERE  UserName = ?;`,
      [this.session?.user?.UserName]
    );
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
    obj.UserName = this.session?.user?.UserName || obj.UserName;
    if (obj.GuestDate) {
      obj.GuestDate = new Date(Date.parse(obj.GuestDate?.toString()));
    }
    await super.checkBusiness(obj, mode);
  }
}
