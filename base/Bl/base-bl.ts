import { IAuthData } from "../api/auth";
import { DbContext } from "../model/dbcontext/dbcontext";
import { IBaseBL } from "./base-bl.interface";

export abstract class BaseBl<T extends object> implements IBaseBL<T> {
  dbContext!: DbContext;
  auth?: IAuthData;
  abstract _tableName: string;
  abstract _idField: string;
  protected activator: () => T;

  constructor(type: { new (): T }, _dbContext?: DbContext) {
    this.activator = () => {
      return new type();
    };
    this.dbContext = _dbContext || new DbContext();
  }

  async getById(id: any): Promise<T | undefined> {
    return await this.dbContext.get<T>(
      `SELECT * FROM ${this._tableName} WHERE ${this._idField} = ?`,
      [id]
    );
  }

  async getAll(): Promise<T[] | undefined> {
    return await this.dbContext.getAll<T>(
      `SELECT * FROM ${this._tableName}`,
      []
    );
  }

  protected async insert(obj: T) {
    const fields = Object.keys(this.activator());
    const _field: any[] = [];
    const param: any[] = [];
    const paramValue: any[] = [];

    Object.keys(obj).forEach((field) => {
      if (fields.indexOf(field) >= 0) {
        param.push("?");
        _field.push(field);
        const value = (obj as any)[field];
        paramValue.push(value == undefined ? null : value);
      }
    });
    const runResult = await this.dbContext.Run(
      `INSERT INTO ${this._tableName} (${_field.join(
        ","
      )}) VALUES (${param.join(",")});`,
      paramValue
    );

    if (runResult.changes > 0) {
      return this.dbContext.get<T>(
        `SELECT * FROM ${this._tableName} WHERE rowid = ?;`,
        [runResult.lastID]
      );
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
    return await this.dbContext.Run(
      `DELETE FROM ${this._tableName} WHERE  ${this._idField} = ?;`,
      id
    );
  }

  async remove(id: any) {
    const obj: any = {};
    obj[this._idField] = id;
    await this.checkBusiness(obj, "DELETE");
    return await this.delete(id);
  }

  protected async update(obj: T) {
    const fields = Object.keys(this.activator());
    const param: any[] = [];
    const paramValue: any[] = [];

    Object.keys(obj).forEach((field) => {
      if (fields.indexOf(field) >= 0 && field != this._idField) {
        param.push(`${field}=?`);
        const value = (obj as any)[field];
        paramValue.push(value == undefined ? null : value);
      }
    });

    await this.dbContext.Run(
      `UPDATE ${this._tableName}
          SET ${param.join(",")}
        WHERE ${this._idField} = ?;`,
      [...paramValue, (obj as any)[this._idField]]
    );

    return this.dbContext.get<T>(
      `SELECT * FROM ${this._tableName} WHERE ${this._idField} = ?;`,
      [(obj as any)[this._idField]]
    );
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
