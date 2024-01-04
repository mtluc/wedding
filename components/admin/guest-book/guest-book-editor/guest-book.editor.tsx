import DictBaseEditor, {
  IDictBaseEditorProps,
  IDictBaseEditorState,
} from "@/components/Controls/mtluc/DictBase/Editor/dict-base-editor";
import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";
import CheckBox from "@/components/Controls/mtluc/Form/Checkbox/checkbox";
import TextBox from "@/components/Controls/mtluc/Form/Textbox/textbox";
import { buildClass, parseDate } from "@/components/Controls/mtluc/base/common";
import { ReactNode } from "react";
import GuestBookService from "../guest-book.service";
import classNames from "./guest-book.editor.module.scss";
import ComboBox from "@/components/Controls/mtluc/Form/Combobox/combobox";
import { Relationship } from "@/model/Relationship/Relationship";
import DatePicker from "@/components/Controls/mtluc/Form/Date/DatePicker/datepicker";
import Numeric from "@/components/Controls/mtluc/Form/Numeric/numeric";

export interface IGuestBookEditorProps extends IDictBaseEditorProps { }

export interface IGuestBookEditorState extends IDictBaseEditorState { }

class GuestBookEditor extends DictBaseEditor<
  IGuestBookEditorProps,
  IGuestBookEditorState
> {
  override title: string = "Khách mời";
  override service: DictBaseService = new GuestBookService();
  override width: number = 720;
  fieldId: string = "Id";
  fieldName: string = "FullName";

  override view(currentRow: any): void {
    let guestDate: Date = currentRow.GuestDate;
    let hours: any = "",
      minute: any = "";
    if (guestDate) {
      guestDate = parseDate(guestDate);
      currentRow.GuestDate = parseDate(guestDate);
      hours = guestDate.getHours();
      minute = guestDate.getMinutes();
    }
    super.view({ ...currentRow, Hours: hours, Minute: minute });
  }

  override edit(currentRow: any): void {
    let guestDate: Date = currentRow.GuestDate;
    let hours = 0,
      minute = 0;
    if (guestDate) {
      guestDate = parseDate(guestDate);
      currentRow.GuestDate = parseDate(guestDate);
      hours = guestDate.getHours();
      minute = guestDate.getMinutes();
    }
    super.edit({ ...currentRow, Hours: hours, Minute: minute });
  }

  override setDataAfterSubmit(data: any, mode: "ADD" | "UPDATE") {
    let guestDate: Date = data.GuestDate;
    let hours: any = "",
      minute: any = "";
    if (guestDate) {
      guestDate = parseDate(guestDate);
      data.GuestDate = parseDate(guestDate);
      hours = guestDate.getHours();
      minute = guestDate.getMinutes();
    }
    return { ...data, Hours: hours, Minute: minute };
  }

  override async setParamBefoSave(param: any) {
    (param.GuestDate as Date).setHours(param.Hours);
    (param.GuestDate as Date).setMinutes(param.Minute);
    return super.setParamBefoSave(param);
  }

  override renderControl(): ReactNode {
    return (
      <div className="row">
        <div className="mtl-control col-4">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="Relationship"
          >
            Quan hệ<span>*</span>
          </label>
          <div className="flex-1">
            <ComboBox
              className="col-12"
              name="Relationship"
              dataSource={Relationship}
              fieldId="Name"
              required
              placeholder="Quan hệ"
            />
          </div>
        </div>

        <div className="mtl-control col-4">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="GuestDate"
          >
            Ngày mời<span>*</span>
          </label>
          <div className="flex-1">
            <DatePicker name="GuestDate" className="col-12" required />
          </div>
        </div>

        <div className="mtl-control col-4">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="Hours"
          >
            Giờ mời<span>*</span>
          </label>
          <div className={buildClass(["flex-1", classNames.time])}>
            <Numeric
              name="Hours"
              className="flex-1"
              creaseButton="none"
              format="0"
              min={0}
              max={23}
              required
            />
            <span>/</span>
            <Numeric
              name="Minute"
              className="flex-1"
              format="0"
              creaseButton="none"
              min={0}
              max={59}
              required
            />
          </div>
        </div>

        <div className="mtl-control col-4">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="ShortName"
          >
            Tên<span>*</span>
          </label>
          <div className="flex-1">
            <TextBox
              className="col-12"
              name="ShortName"
              required
              placeholder="Tên"
            />
          </div>
        </div>

        <div className="mtl-control col-8">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="FullName"
          >
            Họ tên<span>*</span>
          </label>
          <div className="flex-1">
            <TextBox
              className="col-12"
              name="FullName"
              maxLength={25}
              required
              placeholder="Họ tên"
            />
          </div>
        </div>

        <div className="mtl-control col-4">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="Phone"
          >
            SĐT
          </label>
          <div className="flex-1">
            <TextBox
              className="col-12"
              name="Phone"
              placeholder="Số điện thoại"
            />
          </div>
        </div>

        <div className="mtl-control col-2">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="IsConfirm"
          >
            ? xác nhận
          </label>
          <div className="flex-1">
            <CheckBox name="IsConfirm" />
          </div>
        </div>

        <div className="mtl-control col-2">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="IsConfirmBus"
          >
            ? chọn xe
          </label>
          <div className="flex-1">
            <CheckBox name="IsConfirmBus" />
          </div>
        </div>

        <div className="mtl-control col-2">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="Agree"
          >
            Tham dự
          </label>
          <div className="flex-1">
            <CheckBox name="Agree" />
          </div>
        </div>

        <div className="mtl-control col-4">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="BusId"
          >
            Tuyến xe
          </label>
          <div className="flex-1">
            <ComboBox
              className="col-12"
              name="BusId"
              dataSource={[]}
              fieldId="BusId"
              fieldName="BusName"
              placeholder="Tuyến xe"
            />
          </div>
        </div>

        <div className="mtl-control col-md-8">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="Description"
          >
            Ghi chú
          </label>
          <div className="flex-1">
            <TextBox
              className="col-12"
              name="Description"
              placeholder="Ghi chú"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GuestBookEditor;
