import { createClient } from '@vercel/postgres';
import { ISession } from "../session";

export abstract class BaseBlPostgres<T extends object> {

    session?: ISession;
    abstract _tableName: string;
    abstract _idField: string;
    protected activator: () => T;

    constructor(type: { new(): T }) {
        this.activator = () => {
            return new type();
        };
    }

    protected async sqlQuery(sql: string, params?: any[]) {
        const client = createClient();
        await client.connect();
        try {
            return await client.query(sql, params);
        } finally {
            await client.end();
        }
    }

    protected mapObj(rows: any[]) {
        const keys = Object.keys(this.activator());
        const result: T[] = [];
        rows?.forEach(row => {
            const obj: any = {};
            keys?.forEach(key => {
                obj[key] = row[key] || row[key.toLowerCase()]
            });
            result.push(obj)
        })
        return result;
    }

    async getById(id: any) {
        const { rows, fields } = await this.sqlQuery(`SELECT * FROM ${this._tableName} WHERE ${this._idField} = $1 LIMIT 1;`, [id]);
        return this.mapObj(rows)?.[0];
    }

    async getAll() {
        const { rows, fields } = await this.sqlQuery(`SELECT * FROM ${this._tableName};`, []);
        return this.mapObj(rows);
    }

    protected async insert(obj: T) {
        const __fields = Object.keys(this.activator());
        const _field: any[] = [];
        const param: any[] = [];
        const paramValue: any[] = [];

        Object.keys(obj).forEach((field) => {
            if (__fields.indexOf(field) >= 0) {
                _field.push(field);
                param.push(`$${_field.length}`);
                const value = (obj as any)[field];
                paramValue.push(value == undefined ? null : value);
            }
        });
        const { rows, fields } = await this.sqlQuery(
            `INSERT INTO ${this._tableName} (${_field.join(
                ","
            )}) VALUES (${param.join(",")})  RETURNING *;`,
            paramValue
        );

        return this.mapObj(rows)?.[0];

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
        return await this.sqlQuery(
            `DELETE FROM ${this._tableName} WHERE  ${this._idField} = $1;`,
            [id]
        );
    }

    async remove(id: any) {
        const obj: any = {};
        obj[this._idField] = id;
        await this.checkBusiness(obj, "DELETE");
        return await this.delete(id);
    }

    protected async update(obj: T) {
        const __fields = Object.keys(this.activator());
        const param: any[] = [];
        const paramValue: any[] = [];

        Object.keys(obj).forEach((field) => {
            if (__fields.indexOf(field) >= 0 && field != this._idField) {
                param.push(`${field}=$${param.length + 1}`);
                const value = (obj as any)[field];
                paramValue.push(value == undefined ? null : value);
            }
        });

        const { rows, fields } = await this.sqlQuery(
            `UPDATE ${this._tableName}
          SET ${param.join(",")}
        WHERE ${this._idField} = $${param.length + 1} RETURNING *;`,
            [...paramValue, (obj as any)[this._idField]]
        );

        return this.mapObj(rows)?.[0];
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
