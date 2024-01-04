import { BaseBlPostgres } from "@/base/Bl/base-bl.postgres";
import { MD5 } from "@/components/Controls/mtluc/base/common";
import { User } from "./User";

export class UserBl extends BaseBlPostgres<User> {
  _tableName: string = "SysUser";
  _idField: string = "UserName";

  protected override async checkBusiness(
    obj: User,
    mode: "ADD" | "UPDATE" | "DELETE"
  ) {
    switch (mode) {
      case "ADD":
        if (!obj.FullName || !obj.UserName || !obj.Password) {
          throw {
            code: "param_invalid",
            message: "Vui lòng nhập đầy đủ thông tin",
          };
        }
        obj.Password = MD5(obj.Password);
        break;
      case "UPDATE":
        if (obj.Password) {
          obj.Password = MD5(obj.Password);
        }
        break;
    }
    await super.checkBusiness(obj, mode);
  }
}
