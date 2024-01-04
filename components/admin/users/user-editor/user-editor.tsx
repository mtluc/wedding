import DictBaseEditor, {
  IDictBaseEditorProps,
  IDictBaseEditorState,
} from "@/components/Controls/mtluc/DictBase/Editor/dict-base-editor";
import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";
import CheckBox from "@/components/Controls/mtluc/Form/Checkbox/checkbox";
import TextBox from "@/components/Controls/mtluc/Form/Textbox/textbox";
import { buildClass } from "@/components/Controls/mtluc/base/common";
import { ReactNode } from "react";
import UserService from "../user.service";
import classNames from "./user-editor.module.scss";

export interface IUserEditorProps extends IDictBaseEditorProps {}

export interface IUserEditorState extends IDictBaseEditorState {}

class UserEditor extends DictBaseEditor<IUserEditorProps, IUserEditorState> {
  override title: string = "Người dùng";
  override service: DictBaseService = new UserService();
  fieldId: string = "UserName";
  fieldName: string = "FullName";

  override view(currentRow: any): void {
    super.view({ ...currentRow, Password: "" });
  }

  override edit(currentRow: any): void {
    super.edit({ ...currentRow, Password: "" });
  }

  override add(currentRow: any) {
    super.add({ ...currentRow, Actived: true });
  }

  override setDataAfterSubmit(data: any, mode: "ADD" | "UPDATE") {
    return { ...data, Password: "" };
  }

  override async setParamBefoSave(param: any) {
    if (this.mode == "EDIT" && !param.Password) {
      delete param.Password;
    }
    return super.setParamBefoSave(param);
  }

  override renderControl(): ReactNode {
    return (
      <div className="row">
        <div className="mtl-control col-md-12">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="UserName"
          >
            Tên đăng nhập<span>*</span>
          </label>
          <div className="flex-1">
            <TextBox
              className="col-12"
              name="UserName"
              maxLength={20}
              required
              placeholder="Tên đăng nhập"
            />
          </div>
        </div>

        <div className="mtl-control col-md-12">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="FullName"
          >
            Tên người dùng<span>*</span>
          </label>
          <div className="flex-1">
            <TextBox
              className="col-12"
              name="FullName"
              maxLength={25}
              required
              placeholder="Tên người dùng"
            />
          </div>
        </div>

        <div className="mtl-control col-md-12">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="Password"
          >
            Mật khẩu{this.mode == "ADD" ? <span>*</span> : null}
          </label>
          <div className="flex-1">
            <TextBox
              className="col-12"
              name="Password"
              type="password"
              minLength={6}
              maxLength={100}
              required={this.mode == "ADD"}
              placeholder="Mật khẩu"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="mtl-control col-md-12">
          <label
            className={buildClass([classNames.label, "mtl-lable"])}
            htmlFor="Actived"
          >
            Trạng thái
          </label>
          <div className="flex-1">
            <CheckBox name="Actived" />
          </div>
        </div>
      </div>
    );
  }
}

export default UserEditor;
