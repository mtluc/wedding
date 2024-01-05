import { FormEvent, KeyboardEvent, MouseEvent, PureComponent } from "react";
import Form from "../../Form/form";
import MyFormContext, { IFormContext } from "../../Form/form-context";
import Loading from "../../Loading/loading";
import Modal from "../../Modal/modal";
import Portal from "../../Portal/portal";
import { IActionResult } from "../../base/IActionResult";
import {
  handlerRequertException,
  pushDialog,
  pushNotification
} from "../../base/common";
import IconSvg from "../../icon/icon-svg";
import { DictBaseService } from "../Service/dict-base.service";

export interface IDictBaseEditorProps {
  actionResult?: (actionResult: IActionResult<any>) => {};
}

export interface IDictBaseEditorState {
  mode: "ADD" | "EDIT" | "DELETE" | "VIEW";
  isLoading: boolean;
  currentRow: any;
  isShow: boolean;
}

abstract class DictBaseEditor<
  P extends IDictBaseEditorProps,
  S extends IDictBaseEditorState
> extends PureComponent<P, S> {
  fieldId: string = "id";
  fieldName: string = "name";
  width?: number = 450;
  abstract title: string;
  abstract service: DictBaseService;
  abstract renderControl(): React.ReactNode;
  ortherData: any = {};
  isAdd: boolean = true;
  isEdit: boolean = true;
  isDelete: boolean = true;
  formCtx = new MyFormContext();

  get currentRow() {
    return this.state.currentRow;
  }

  set currentRow(row: any) {
    this.setState({ currentRow: row });
    this.parseFormValue(row);
  }

  get isShow() {
    return this.state.isShow;
  }

  set isShow(isShow: boolean) {
    this.setState({ isShow });
  }


  handlerKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey) {
      const key = e.key.toLowerCase();
      if (['q', 'e', 'r', 'd', 's'].indexOf(key) >= 0) {
        switch (key) {
          //Thêm mới
          case 'q':
            if (this.mode != "ADD" && this.isAdd) {
              e.preventDefault();
              this.add({});
            }
            break;
          //Thêm sửa
          case 'e':
            if (this.mode != "ADD" && this.mode != "EDIT" && this.mode != "DELETE" && this.isEdit) {
              e.preventDefault();
              this.edit(this.currentRow);
            }
            break;

          //Sao
          case 'r':
            if (this.mode != "ADD" && this.mode != "EDIT" && this.mode != "DELETE" && this.isAdd) {
              e.preventDefault();
              this.duplicate(this.currentRow);
            }
            break;
          //Xóa
          case 'e':
            if (this.mode != "ADD" && this.mode != "DELETE" && this.isDelete) {
              e.preventDefault();
              this.delete();
            }
            break;
          //Lưu
          case 's':
            if (this.mode == "ADD" || this.mode == "EDIT") {
              e.preventDefault();
              this.onSubmit(e, this.formCtx.getValues(), this.formCtx);
            }
            break;
        }
      }
    }
  }

  get mode() {
    return this.state.mode;
  }

  set mode(mode: "ADD" | "EDIT" | "DELETE" | "VIEW") {
    this.setState({ mode });
    this.setReadonlyByMode(mode);
  }

  setReadonlyByMode(mode: "ADD" | "EDIT" | "DELETE" | "VIEW") {
    switch (mode) {
      case "ADD":
        this.formCtx?.setReadonlyAll(false);
        break;
      case "EDIT":
        this.formCtx?.setReadonlyAll(false);
        this.formCtx?.setReadonlyById(this.fieldId, true);
        break;
      default:
        this.formCtx?.setReadonlyAll(true);
        break;
    }
  }

  constructor(_props: P) {
    super(_props);
    this.state = this.initState(_props);
  }

  initState(_props: P): S {
    return {
      mode: "VIEW",
      isLoading: false,
      currentRow: {},
      isShow: false,
    } as S;
  }

  getTitle() {
    switch (this.mode) {
      case "ADD":
        return `Thêm - ${this.title}`;
      case "EDIT":
        return `Sửa - ${this.title}`;
      default:
        return this.title;
    }
  }

  handlerTaskBarClick(
    e: MouseEvent,
    type: "ADD" | "EDIT" | "DELETE" | "SUBMIT" | "DUPLICATE"
  ) {
    if (type === "SUBMIT") {
      return;
    }
    e.preventDefault();
    switch (type) {
      case "ADD":
        this.add({});
        break;
      case "DUPLICATE":
        this.duplicate(this.currentRow);
        break;
      case "EDIT":
        this.edit(this.currentRow);
        break;
      case "DELETE":
        this.delete();
        break;
    }
  }

  renderTaskBar() {
    switch (this.mode) {
      case "ADD":
      case "EDIT":
        return (
          <div className="taskbar">
            <button
              type="submit"
              className="btn-primary-ltr"
              onClick={(e) => {
                this.handlerTaskBarClick(e, "SUBMIT");
              }}
            >
              <IconSvg iconKeys="save" />
              <span>Lưu</span>
            </button>
          </div>
        );
      default:
        return (
          <div className="taskbar">
            {this.isAdd ? (
              <button
                type="button"
                className="btn"
                onClick={(e) => {
                  this.handlerTaskBarClick(e, "ADD");
                }}
              >
                <IconSvg iconKeys="plus" />
                <span>Thêm</span>
              </button>
            ) : null}

            {this.isAdd ? (
              <button
                type="button"
                className="btn"
                onClick={(e) => {
                  this.handlerTaskBarClick(e, "DUPLICATE");
                }}
              >
                <IconSvg iconKeys="duplicate" />
                <span>Sao</span>
              </button>
            ) : null}

            {this.isEdit ? (
              <button
                type="button"
                className="btn"
                onClick={(e) => {
                  this.handlerTaskBarClick(e, "EDIT");
                }}
              >
                <IconSvg iconKeys="edit" />
                <span>Sửa</span>
              </button>
            ) : null}

            {this.isDelete ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={(e) => {
                  this.handlerTaskBarClick(e, "DELETE");
                }}
              >
                <IconSvg iconKeys="delete" />
                <span>Xóa</span>
              </button>
            ) : null}
          </div>
        );
    }
  }

  setLoading(isLoading: boolean) {
    this.setState({
      isLoading,
    });
  }

  setDataAfterSubmit(data: any, mode: "ADD" | "UPDATE") {
    return data;
  }

  async onSubmit(e: FormEvent, value: any, form: IFormContext) {
    try {
      e.preventDefault();
      const param = await this.setParamBefoSave(value);
      let respon: any = {};
      this.setLoading(true);
      switch (this.mode) {
        case "ADD":
          respon = await await this.service.addItem(param);
          this.mode = "VIEW";
          this.currentRow = this.setDataAfterSubmit(respon.data, "ADD");
          this.props?.actionResult?.({ mode: "ADD", record: respon.data });
          pushNotification({ type: "success", message: "Thêm thành công" });
          this.formCtx?.clearError();
          break;
        case "EDIT":
          console.log({
            [this.fieldId]: this.currentRow[this.fieldId],
            ...param,
          });
          respon = await this.service.updateItem({
            [this.fieldId]: this.currentRow[this.fieldId],
            ...param,
          });
          this.mode = "VIEW";
          this.currentRow = this.setDataAfterSubmit(respon.data, "UPDATE");
          this.props?.actionResult?.({ mode: "EDIT", record: respon.data });
          pushNotification({ type: "success", message: "Lưu thành công" });
          this.formCtx?.clearError();
          break;
      }
    } catch (error) {
      handlerRequertException(error);
    } finally {
      this.setLoading(false);
    }
  }

  async setParamBefoSave(param: any) {
    return param;
  }

  focusFirstControlEnable() {
    const controls = this.formCtx?.controls;
    if (controls?.length) {
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        if (!control.readonly && !control.disabled) {
          setTimeout(() => {
            this.formCtx.focus?.(control.id);
          }, 100);
          return;
        }
      }
    }
  }

  view(currentRow: any) {
    currentRow = currentRow || {};
    this.isShow = true;
    this.mode = "VIEW";
    this.currentRow = currentRow;
    setTimeout(() => {
      this.setReadonlyByMode("VIEW");
      this.parseFormValue(currentRow);
      if (this.formCtx?.controls?.[0]) {
        this.formCtx.focus?.(this.formCtx.controls?.[0]?.id);
      }
      this.formCtx.clearError();
    }, 100);
  }

  add(currentRow: any) {
    if (this.isAdd) {
      currentRow = currentRow || {};
      this.isShow = true;
      this.mode = "ADD";
      this.currentRow = currentRow;
      this.formCtx?.clearError();
      setTimeout(() => {
        this.setReadonlyByMode("ADD");
        this.parseFormValue(currentRow);
        this.focusFirstControlEnable();
        this.formCtx?.clearError();
      }, 100);
    }

  }

  edit(currentRow: any) {
    if (this.isEdit) {
      currentRow = currentRow || {};
      this.isShow = true;
      this.mode = "EDIT";
      this.currentRow = currentRow;
      this.formCtx?.clearError();
      setTimeout(() => {
        this.setReadonlyByMode("EDIT");
        this.parseFormValue(currentRow);
        this.formCtx?.clearError();
        this.focusFirstControlEnable();
      }, 100);
    }

  }

  duplicate(row: any) {
    const _row = { ...row, [this.fieldId]: undefined }
    this.add(_row);
  }

  async delete() {
    if (this.isDelete) {

      try {
        const confirmResult = await pushDialog({
          content: `Bạn muốn xóa ${this.title?.toLowerCase()} <strong>${this.currentRow[this.fieldName]
            }</strong>?`,
          type: "question",
          title: "Xác nhận xóa",
        });

        if (confirmResult == "accept" && this.currentRow) {
          this.setLoading(true);
          const respon = await this.service.deleteItem(
            this.currentRow[this.fieldId]
          );
          if (respon?.data) {
            this.isShow = false;
            pushNotification({
              message: `Đã xóa ${this.title?.toLowerCase()}`,
              type: "success",
            });
            this.props.actionResult?.({
              mode: "DELETE",
              record: this.currentRow,
            });
          }
        }
      } catch (error) {
        handlerRequertException(error);
      } finally {
        this.setLoading(false);
      }
    }
  }

  parseFormValue(currentRow: any) {
    this.formCtx?.controls?.map((ctr) => {
      if (ctr.type == "radio") {
        this.formCtx.setValue(ctr.name, currentRow[ctr.name]);
      } else {
        this.formCtx.setValue(ctr.id, currentRow[ctr.id]);
      }
    });
  }

  async loadData() { }

  componentDidMount(): void {
    this.loadData();
  }
  render() {
    return (
      <>
        {this.state.isShow ? (
          <Portal>
            <Modal
              title={this.getTitle()}
              onClose={() => {
                this.isShow = false;
              }}
              onKeyDown={(e) => this.handlerKeyDown(e)}
            >
              <Form
                class="dict-base-form"
                onSubmit={this.onSubmit.bind(this)}
                styles={{ width: this.width }}
                ctx={this.formCtx}
              >
                {this.state.isLoading ? <Loading /> : null}
                {this.renderControl()}
                {this.renderTaskBar()}
              </Form>
            </Modal>
          </Portal>
        ) : null}
      </>
    );
  }
}
export default DictBaseEditor;
