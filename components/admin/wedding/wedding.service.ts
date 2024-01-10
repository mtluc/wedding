import { HttpRespon, httpClient } from "@/base/httpClient";
import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";

class WeddingService extends DictBaseService {
  public override url: string = "/api/Wedding";

  public getByIdOrDefault() {
    return httpClient.getJson<any[]>(
      httpClient.getUri(`${this.url}/GetByIdOrDefault`)
    );
  }
}
export default WeddingService;
