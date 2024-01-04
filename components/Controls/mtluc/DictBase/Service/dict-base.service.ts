import { httpClient } from "@/base/httpClient";

export abstract class DictBaseService {
  public abstract url: string;

  /**
   * Lấy danh sách item
   */
  public getDatas() {
    return httpClient.getJson<any[]>(this.url);
  }

  /**
   * Thêm mới 1 bản ghi
   * @param param
   * @returns
   */
  public addItem(param: any) {
    return httpClient.postJson<any>(this.url, param);
  }

  /**
   * Update 1 bản ghi
   * @param param
   * @returns
   */
  public updateItem(param: any) {
    return httpClient.putJson<any>(this.url, param);
  }

  /**
   * Xóa 1 bản ghi
   * @param param
   * @returns
   */
  public deleteItem(id: string) {
    return httpClient.deleteJson<any>(this.url, { id });
  }
}
