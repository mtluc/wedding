import { Database } from "sqlite3";
const path = require('path');

const sqlite3 = require("sqlite3").verbose();

export class DbContext {
  pathDbFile: string = `${path.resolve(__dirname).split('.next')[0]}/db/mydb.sqlite3`;
  db?: Database;

  constructor() {
  }
  open() {
    return new Promise<Database>((resolve, rejects) => {
      this.db = new sqlite3.Database(
        this.pathDbFile,
        sqlite3.OPEN_READWRITE,
        (err: any) => {
          rejects(err);
        }
      ) as Database;
      resolve(this.db);
    });
  }

  close() {
    this.db?.close((err) => {
      console.error(err);
    });
  }

  //#region get
  private _get<T>(sql: string, param: any[]) {
    return new Promise<T>((resolve, rejects) => {
      this.db?.get(sql, param, (err, row) => {
        if (err) {
          rejects(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  async get<T>(sql: string, param: any[]) {
    try {
      await this.open();
      return await this._get<T>(sql, param);
    } catch (error) {
      throw error;
    } finally {
      this.close();
    }
  }
  //#endregion

  //#region getAll
  private _getAll<T>(sql: string, param: any[]) {
    return new Promise<T[]>((resolve, rejects) => {
      this.db?.all(sql, param, (err, rows) => {
        if (err) {
          rejects(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  async getAll<T>(sql: string, param: any[]) {
    try {
      await this.open();
      return await this._getAll<T>(sql, param);
    } catch (error) {
      throw error;
    } finally {
      this.close();
    }
  }
  //#endregion

  //#region getAll
  private _Run(sql: string, param: any[]) {
    return new Promise<{ lastID: number; changes: number }>(
      (resolve, rejects) => {
        this.db?.run(sql, param, function (err) {
          if (err) {
            rejects(err);
          } else {
            resolve(this as any);
          }
        });
      }
    );
  }

  async Run(sql: string, param: any[]) {
    try {
      await this.open();
      return await this._Run(sql, param);
    } catch (error) {
      throw error;
    } finally {
      this.close();
    }
  }
  //#endregion
}
