import DictBaseEditor from "@/components/Controls/mtluc/DictBase/Editor/dict-base-editor";
import DictBaseListing, {
  IDictBaseListProps,
  IDictBaseListState,
} from "@/components/Controls/mtluc/DictBase/Listing/dict-base-listing";
import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";
import { IColumn } from "@/components/Controls/mtluc/Grid/Column/column";
import { ReactElement } from "react";
import GuestBookEditor from "../guest-book-editor/guest-book.editor";
import GuestBookService from "../guest-book.service";

interface IGuestBookListProps extends IDictBaseListProps {}

interface IGuestBookListState extends IDictBaseListState {}

class GuestBookList extends DictBaseListing<
  IGuestBookListProps,
  IGuestBookListState,
  GuestBookEditor
> {
  override title: string = "Khách mời";
  override showTitle: boolean = false;
  override fieldId: string = "Id";
  override fieldName: string = "FullName";
  override service: DictBaseService = new GuestBookService();

  override initColums(): IColumn[] {
    return [
      {
        Id: "Relationship",
        Title: "Quan hệ",
        MinWidth: 100,
        MaxWidth: 100,
      },
      {
        Id: "ShortName",
        Title: "Tên",
        MinWidth: 100,
      },
      {
        Id: "FullName",
        Title: "Tên đầy đủ",
        MinWidth: 200,
      },
      {
        Id: "Phone",
        Title: "Số điện thoại",
        MinWidth: 100,
        Type: "phone",
      },
      {
        Id: "GuestDate",
        Title: "Thời gian mời",
        Type: "date",
        Format: "HH:MM  - dd/mm/yyyy",
        MinWidth: 150,
      },
      {
        Id: "Description",
        Title: "Ghi chú",
        MinWidth: 300,
      },
      {
        Id: "IsConfirm",
        Title: "Hỏi tham dự",
        Type: "check",
        MinWidth: 100,
        MaxWidth: 100,
      },
      {
        Id: "IsConfirmBus",
        Title: "Hỏi chọn xe",
        Type: "check",
        MinWidth: 100,
        MaxWidth: 100,
      },
      {
        Id: "Agree",
        Title: "Tham dự",
        Type: "check",
        MinWidth: 80,
        MaxWidth: 100,
      },
      {
        Id: "BusId",
        Title: "Tuyến xe",
        Type: "combobox",
        MinWidth: 200,
        DataSource: [],
        FieldId: "BusId",
        FieldName: "BusName",
      },
      {
        Id: "Sent",
        Title: "Đã mời",
        Type: "check",
        MinWidth: 80,
        MaxWidth: 100,
      },
    ];
  }
  override renderDetail(): ReactElement<DictBaseEditor<any, any>> {
    return (
      <GuestBookEditor
        ref={this.detailRef}
        actionResult={this.handlerActionResult.bind(this)}
      />
    );
  }
}
export default GuestBookList;
