// import { BaseBl } from "@/base/Bl/base-bl";
import { BaseBl } from "@/base/Bl/base-bl.mongo";
import { Wedding } from "./wedding";
import { weddingDb } from "../MongoDB/weddingDbContext";

export class WeddingBl extends BaseBl<Wedding> {
  _tableName: string = "Wedding";
  _idField: string = "UserName";

  constructor(type: { new(): Wedding }) {
    super(type, weddingDb);
  }

  override async edit(obj: Wedding) {
    const oldObj = await this.getById((obj as any)[this._idField]);

    if (!oldObj) {
      await this.checkBusiness(obj, "ADD");
      return (await this.insert(obj)) as any;
    } else {
      await this.checkBusiness(obj, "UPDATE");
      return await this.update(obj);
    }
  }

  protected override async checkBusiness(
    obj: Wedding,
    mode: "UPDATE" | "ADD" | "DELETE"
  ) {
    if (mode == "ADD" && !obj.UserName) {
      obj.UserName = this.auth?.user?.UserName || "";
    }
    super.checkBusiness(obj, mode);
  }
}
