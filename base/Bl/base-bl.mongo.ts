import { BaseDb } from "@/model/MongoDB/weddingDbContext";
import { IAuthData } from "../api/auth";
import { Filter, ObjectId } from "mongodb";
import { IBaseBL } from "./base-bl.interface";

export abstract class BaseBl<T extends object> implements IBaseBL<T> {
  dbContext!: BaseDb;
  auth?: IAuthData;
  abstract _tableName: string;
  abstract _idField: string;
  protected activator: () => T;

  constructor(type: { new (): T }, _dbContext?: BaseDb) {
    this.activator = () => {
      return new type();
    };
    this.dbContext = _dbContext || new BaseDb();
  }

  async getData(filter: Filter<T>) {
    return await this.dbContext.find<T>(this._tableName, filter);
  }

  async getDatas(filter: Filter<T>) {
    return await this.dbContext.filter<T>(this._tableName, filter);
  }

  async getById(id: any) {
    return await this.dbContext.find<T>(this._tableName, {
      [this._idField]: id,
    } as any);
  }

  async getAll() {
    return await this.dbContext.filter<T>(this._tableName, {});
  }

  protected async insert(obj: T) {
    const fields = Object.keys(this.activator());
    const paramValue: T = {} as T;

    fields.forEach((key) => {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        (obj as any)[key] != undefined &&
        (obj as any)[key] != null
      ) {
        (paramValue as any)[key] = (obj as any)[key];
      }
    });

    const runResult = await this.dbContext.add(this._tableName, [paramValue]);
    if (runResult.insertedCount > 0) {
      return await this.getData({
        _id: runResult.insertedIds[0],
      } as any);
    }
  }

  async add(obj: T) {
    await this.checkBusiness(obj, "ADD");
    const oldObj = await this.getById((obj as any)[this._idField]);
    if (oldObj) {
      throw {
        code: "record_exists",
        message: `${(obj as any)[this._idField]} đã tồn tại!`,
      };
    } else {
      return await this.insert(obj);
    }
  }

  protected async delete(id: any) {
    const result = await this.dbContext.delete(this._tableName, {
      [this._idField]: id,
    } as any);
    return {
      lastID: 0,
      changes: result.deletedCount,
    };
  }

  async remove(id: any) {
    const obj: any = {};
    obj[this._idField] = id;
    await this.checkBusiness(obj, "DELETE");
    return await this.delete(id);
  }

  protected async update(obj: T) {
    const fields = Object.keys(this.activator());
    const paramValue: Partial<T> = {};

    fields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key != this._idField && key != "_id") {
          (paramValue as any)[key] = (obj as any)[key];
        }
      }
    });

    const result = await this.dbContext.update(
      this._tableName,
      {
        [this._idField]: (obj as any)[this._idField],
      } as any,
      paramValue
    );
    console.log(result);
    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return await this.getById((obj as any)[this._idField]);
    } else {
      return obj;
    }
  }

  async edit(obj: T) {
    await this.checkBusiness(obj, "UPDATE");
    const oldObj = await this.getById((obj as any)[this._idField]);
    if (!oldObj) {
      throw {
        code: "record_not_exists",
        message: `${(obj as any)[this._idField]} không tồn tại!`,
      };
    } else {
      return await this.update(obj);
    }
  }

  protected async checkBusiness(obj: T, mode: "ADD" | "UPDATE" | "DELETE") {
    if (
      (mode == "DELETE" || mode == "UPDATE") &&
      !(obj as any)[this._idField]
    ) {
      throw {
        code: "param_invalid",
        message: "Vui lòng nhập đầy đủ thông tin!",
      };
    }
  }
}
