import { IAuthData } from "../api/auth";

export interface IBaseBL<T extends object> {
  _tableName: string;
  _idField: string;
  auth?: IAuthData;
  getById(id: any): Promise<T | undefined | null>;
  getAll(): Promise<T[] | undefined | null>;
  add(obj: T): Promise<T | undefined | null>;
  remove(id: any): Promise<{
    lastID: any;
    changes: number;
  }>;
  edit(obj: T): Promise<T | undefined | null>;
}
