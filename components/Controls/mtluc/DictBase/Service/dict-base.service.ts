import { httpClient } from "@/base/httpClient";

export abstract class DictBaseService {
  public abstract url: string;

  /**
   * Lấy danh sách item
   */
  public getDatas() {
    return httpClient.getJson<any[]>(httpClient.getUri(this.url));
  }

  /**
   * Lấy danh sách item
   */
  public getById(id: any) {
    return httpClient.getJson<any[]>(httpClient.getUri(`${this.url}/getById`), {
      id: id,
    });
  }

  /**
   * Thêm mới 1 bản ghi
   * @param param
   * @returns
   */
  public addItem(param: any) {
    return httpClient.postJson<any>(httpClient.getUri(this.url), param);
  }

  /**
   * Update 1 bản ghi
   * @param param
   * @returns
   */
  public updateItem(param: any) {
    return httpClient.putJson<any>(httpClient.getUri(this.url), param);
  }

  /**
   * Xóa 1 bản ghi
   * @param param
   * @returns
   */
  public deleteItem(id: string) {
    return httpClient.deleteJson<any>(httpClient.getUri(this.url), { id });
  }
}
