import { IBaseBL } from "../Bl/base-bl.interface";
import { BaseApi } from "./base-api";

export abstract class DictBaseApi<T extends IBaseBL<any>> extends BaseApi<T> {
  override async get() {
    try {
      this.checkAuth();
      const datas = await this._bl.getAll();
      this.res.status(200).json(datas);
    } catch (error) {
      this.processError(error);
    }
  }

  override async post() {
    try {
      this.checkAuth();
      const data = await this._bl.add(this.body as T);
      this.res.status(200).json(data);
    } catch (error) {
      this.processError(error);
    }
  }

  override async put() {
    try {
      this.checkAuth();
      const data = await this._bl.edit(this.body as T);
      this.res.status(200).json(data);
    } catch (error) {
      this.processError(error);
    }
  }

  override async delete(): Promise<void> {
    try {
      this.checkAuth();
      const data = await this._bl.remove(this.query.id);
      this.res.status(200).json(data);
    } catch (error) {
      this.processError(error);
    }
  }

  async getById() {
    try {
      this.checkAuth();
      const data = await this._bl.getById(this.query.id);
      this.res.status(200).json(data || null);
    } catch (error) {
      this.processError(error);
    }
  }

  override run() {
    if (this.action) {
      console.log(this.query.id, this.action);
      const actionName = [
        ...Object.getOwnPropertyNames(DictBaseApi.prototype),
      ].find(
        (x) =>
          typeof (this as any)[x] == "function" &&
          x.toLowerCase() == this.action
      );
      if (actionName) {
        (this as any)[actionName]();
        return;
      }
    }
    super.run();
  }
}
