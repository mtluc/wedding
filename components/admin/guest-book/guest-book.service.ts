import { httpClient } from "@/base/httpClient";
import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";

class GuestBookService extends DictBaseService {
  public override url: string = "/api/GuestBook";

  async accept(id: number, accept: boolean) {
    return httpClient.putJson<any>(httpClient.getUri(`${this.url}/accept`), {
      id: id,
      accept: accept,
    });
  }
}
export default GuestBookService;
