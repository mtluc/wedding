import { BaseBl } from "../Bl/base-bl";
import { BaseApi } from "./base-api";

export abstract class DictBaseApi<T extends BaseBl<any>> extends BaseApi<T> {
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
      this.res.status(200).json(data);
    } catch (error) {
      this.processError(error);
    }
  }
}
