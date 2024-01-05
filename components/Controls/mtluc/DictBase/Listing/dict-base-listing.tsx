import {
  Component,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  RefObject,
  createRef,
} from "react";
import { IColumn } from "../../Grid/Column/column";
import Grid from "../../Grid/grid";
import Loading from "../../Loading/loading";
import { IActionResult } from "../../base/IActionResult";
import { IToolbar } from "../../base/Itoolbar";
import {
  handlerDocumentKeyDown,
  handlerRequertException,
  pushDialog,
  pushNotification,
} from "../../base/common";
import DictBaseEditor from "../Editor/dict-base-editor";
import { DictBaseService } from "../Service/dict-base.service";
import IconSvg from "../../icon/icon-svg";

export interface IDictBaseListProps {
  children?: React.ReactNode;
}
export interface IDictBaseListState {
  isLoading: boolean;
  toolbars: IToolbar[];
  rowSelected:
  | {
    row: any;
    idx: number;
  }
  | undefined;
  datas: any[];
  columns: IColumn[];
}

abstract class DictBaseListing<
  P extends IDictBaseListProps,
  S extends IDictBaseListState,
  D extends DictBaseEditor<any, any>
> extends Component<P, S> {
  fieldId: string = "id";
  fieldName: string = "name";
  abstract title: string;
  abstract initColums(): IColumn[];
  abstract service: DictBaseService;
  abstract renderDetail(): ReactElement<DictBaseEditor<any, any>>;

  showTitle: boolean = true;

  gridRef?: RefObject<Grid>;

  detailRef?: RefObject<D>;

  get detailComponent() {
    return this.detailRef?.current;
  }

  get grid() {
    return this.gridRef?.current;
  }

  get rowSelected() {
    return this.state.rowSelected;
  }

  set rowSelected(row: { row: any; idx: number } | undefined) {
    this.setState({
      rowSelected: row,
    });

    this.enableToolBar(row);

    if (this.grid) {
      this.grid.rowSelected = row;
    }
  }

  get columns() {
    return this.state.columns;
  }

  set columns(cols: IColumn[]) {
    this.setState({
      columns: cols,
    });
  }

  constructor(_props: P, ctx?: any) {
    super(_props);
    this.context = ctx;
    this.state = this.initState(_props);
    this.gridRef = createRef<Grid>();
    this.detailRef = createRef<D>();
  }

  public initState(_props: P): S {
    return {
      isLoading: false,
      toolbars: this.initToolbar(),
      rowSelected: undefined,
      datas: [],
      columns: this.initColums(),
    } as any as S;
  }

  public initToolbar(): IToolbar[] {
    return [
      {
        id: "VIEW",
        text: "Xem",
        disabled: true,
        class: "btn btn-view",
        iconKey: "view",
      },
      {
        id: "ADD",
        text: "Thêm",
        disabled: false,
        class: "btn btn-add",
        iconKey: "plus",
      },
      {
        id: "DUPLICATE",
        text: "Sao",
        disabled: true,
        class: "btn btn-add",
        iconKey: "duplicate",
      },
      {
        id: "EDIT",
        text: "Sửa",
        disabled: true,
        class: "btn btn-edit",
        iconKey: "edit",
      },
      {
        id: "DELETE",
        text: "Xóa",
        disabled: true,
        class: "btn btn-delete btn-danger",
        iconKey: "delete",
      },
      {
        id: "RELOAD",
        text: "Tải lại",
        disabled: false,
        class: "btn",
        iconKey: "reload",
      },
    ];
  }

  public async initData() {
    try {
      this.setLoading(true);
      const data = await Promise.all([this.loadData()]);
      this.setState({
        datas: data[0],
      });
    } catch (error) {
      handlerRequertException(error);
    } finally {
      this.setLoading(false);
    }
  }

  public enableToolBar(currentRow: any) {
    const toolbars = this.state.toolbars;
    toolbars.forEach((button) => {
      switch (button.id) {
        case "VIEW":
        case "EDIT":
        case "DELETE":
        case "DUPLICATE":
          button.disabled = !currentRow;
          break;
      }
    });
    this.setState({ toolbars });
  }

  public async handlerToolBarClick(e: MouseEvent, btn: IToolbar) {
    try {
      switch (btn.id) {
        case "VIEW":
          this.view();
          break;
        case "ADD":
          this.add();
          break;
        case "EDIT":
          this.edit();
          break;
        case "DUPLICATE":
          this.duplicate();
          break;
        case "DELETE":
          this.delete();
          break;
        case "RELOAD":
          this.reload();
          break;
      }
    } catch (error) {
      handlerRequertException(error);
    }
  }

  public view() {
    if (this.rowSelected?.row) {
      this.detailComponent?.view(this.rowSelected?.row);
    }
  }

  public add() {
    this.detailComponent?.add({});
  }

  public edit() {
    if (this.rowSelected?.row) {
      this.detailComponent?.edit(this.rowSelected?.row);
    }
  }

  public async delete() {
    try {
      if (this.rowSelected?.row) {
        const confirmResult = await pushDialog({
          content: `Bạn muốn xóa ${this.title?.toLowerCase()} <strong>${this.rowSelected?.row[this.fieldName]
            }</strong>?`,
          type: "question",
          title: "Xác nhận xóa",
        });

        if (confirmResult == "accept" && this.rowSelected) {
          this.setLoading(true);
          const respon = await this.service.deleteItem(
            (this.rowSelected.row as any)[this.fieldId]
          );
          if (respon?.data) {
            pushNotification({
              message: `Đã xóa ${this.title?.toLowerCase()}`,
              type: "success",
            });
            this.handlerActionResult({
              mode: "DELETE",
              record: this.rowSelected.row,
            });
          }
        }
      }
    } catch (error) {
      handlerRequertException(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async handlerActionResult(actionResult: IActionResult<any>) {
    try {
      if (actionResult.record) {
        const datas = this.state.datas || [];
        const idx = datas.findIndex(
          (x: any) => x[this.fieldId] === actionResult.record[this.fieldId]
        );
        switch (actionResult.mode) {
          case "ADD":
            this.setState({
              datas: [...datas, actionResult.record],
            });
            this.rowSelected = {
              row: actionResult.record,
              idx: datas.length,
            };
            break;
          case "EDIT":
            if (idx >= 0) {
              this.rowSelected = {
                idx: idx,
                row: actionResult.record,
              };
            }
            datas[idx] = actionResult.record;
            this.setState({ datas });
            break;
          case "DELETE":
            datas.splice(idx, 1);
            if (datas.length && idx >= 0) {
              if (idx == 0) {
                this.rowSelected = {
                  row: datas[0],
                  idx: 0,
                };
              } else if (idx == datas.length) {
                this.rowSelected = {
                  row: datas[datas.length - 1],
                  idx: datas.length - 1,
                };
              } else {
                this.rowSelected = {
                  row: datas[idx],
                  idx: idx,
                };
              }
            } else {
              this.rowSelected = undefined;
            }
            this.setState({ datas });
            break;
        }
      }
    } catch (error) {
      handlerRequertException(error);
    }
  }

  public async reload() {
    try {
      this.setLoading(true);
      const datas = await this.loadData();
      if (datas?.length) {
        this.rowSelected = {
          row: datas[0],
          idx: 0,
        };
      } else {
        this.rowSelected = undefined;
      }
      this.setState({ datas: datas || [] });
    } catch (error) {
      handlerRequertException(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async loadData() {
    const res = await this.service.getDatas();
    return res?.data || [];
  }

  public setLoading(isLoading: boolean) {
    this.setState({ isLoading });
  }

  removeKeydownEvent?: () => void;
  componentDidMount(): void {
    this.initData();
    this.removeKeydownEvent = handlerDocumentKeyDown((e) => {
      this.onKeyDown(e);
    })
  }

  async onKeyDown(e: KeyboardEvent) {
    try {
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (['q', 'e', 'r', 'd', 's'].indexOf(key) >= 0) {
          switch (key) {
            //Thêm mới
            case 'q':
              e.preventDefault();
              this.add();
              break;
            //Thêm sửa
            case 'e':
              e.preventDefault();
              this.edit();
              break;
            //Sao
            case 'r':
              e.preventDefault();
              this.duplicate();
              break;
            //Xóa
            case 'd':
              const toolbar = this.initToolbar();
              if (toolbar.find(x => x.iconKey == 'delete')) {
                e.preventDefault();
                this.delete();
              }
              break;
          }
        }
      }
    } catch (error) { }
  }

  duplicate() {
    if (this.rowSelected?.row) {
      this.detailComponent?.duplicate(this.rowSelected?.row);
    }
  }

  componentWillUnmount(): void {
    this.removeKeydownEvent?.();
    this.removeKeydownEvent = undefined;
  }
  render() {
    return (
      <>
        <div className="dict-base-list">
          {this.state.isLoading ? <Loading /> : null}
          {this.title && this.showTitle ? (
            <div className="title">
              <div className="title-content">{this.title}</div>
            </div>
          ) : null}
          {this.state.toolbars?.length ? (
            <div className="toolbar">
              {this.state.toolbars.map((btn, idx) => {
                return (
                  <button
                    key={idx}
                    className={btn.class}
                    type="button"
                    onClick={(e) => {
                      this.handlerToolBarClick(e, btn);
                    }}
                    disabled={btn.disabled}
                  >
                    {btn.iconKey ? (
                      <IconSvg className={btn.iconCls} iconKeys={btn.iconKey} />
                    ) : null}
                    <span>{btn.text}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="listing">
            <Grid
              ref={this.gridRef}
              columns={this.state.columns}
              datas={this.state.datas}
              onRowClick={(e, row, rowIdx) => {
                this.rowSelected = {
                  row,
                  idx: rowIdx,
                };
              }}
              onRowDoubleClick={() => {
                this.view();
              }}
            />
          </div>
        </div>
        {this.renderDetail()}
      </>
    );
  }
}
export default DictBaseListing;
