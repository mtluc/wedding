// import { BaseBl } from "@/base/Bl/base-bl";
import { MD5 } from "@/components/Controls/mtluc/base/common";
import { User } from "./User";
import { BaseBl } from "@/base/Bl/base-bl.mongo";

export class UserBl extends BaseBl<User> {
  _tableName: string = "User";
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

  override async edit(obj: User): Promise<User | null> {
    const result = await super.edit(obj);
    return { ...obj, ...result, Password: "" };
  }

  override async getAll(): Promise<User[]> {
    let result = await super.getAll();
    result = result.map((x) => {
      return { ...x, Password: "" };
    });
    return result;
  }

  override async getById(id: any): Promise<User | null> {
    const result = await super.getById(id);
    if (result) {
      result.Password = "";
    }
    return result;
  }

  override async add(obj: User): Promise<User | null | undefined> {
    const result = await super.add(obj);
    if (result) {
      result.Password = "";
    }
    return result;
  }
}
