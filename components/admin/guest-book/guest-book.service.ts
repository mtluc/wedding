import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";

class GuestBookService extends DictBaseService {
  public override url: string = "/api/GuestBook";
}
export default GuestBookService;
