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
  buildClass,
  handlerDocumentKeyDown,
  handlerRequertException,
  pushDialog,
  pushNotification,
} from "../../base/common";
import DictBaseEditor from "../Editor/dict-base-editor";
import { DictBaseService } from "../Service/dict-base.service";
import IconSvg from "../../icon/icon-svg";
import TextBox from "../../Form/Textbox/textbox";
import { DropDown } from "../../Dropdown/dropdown";
import MyFormContext from "../../Form/form-context";
import Form from "../../Form/form";
import CheckBox from "../../Form/Checkbox/checkbox";
import FilterDropDown from "../../Grid/FilterDropdown/filter-dropdown";
import { IFilter } from "../../Grid/FilterDropdown/filter.interface";

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
  singlePageInfo: {
    countItem: 0;
    totalItem: 0;
  };
  keySearch?: string;
  filters: IFilter[];
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
  showSinglePageInfo: boolean = true;
  showSearchBar: boolean = true;
  searchBarPlaholder: string = "Tìm kiếm";
  btFilterRef!: RefObject<HTMLButtonElement>;
  formCtx = new MyFormContext();

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
    this.btFilterRef = createRef<HTMLButtonElement>();
  }

  public initState(_props: P): S {
    return {
      isLoading: false,
      toolbars: this.initToolbar(),
      rowSelected: undefined,
      datas: [],
      columns: this.initColums(),
      singlePageInfo: {
        countItem: 0,
        totalItem: 0,
      },
      keySearch: "",
      filters: [],
    } as any as S;
  }

  localFilter(datas: any[]) {
    let result = datas.filter((item) => {
      if (!this.state.keySearch) {
        return true;
      }
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        if (col.Id) {
          if (
            (!col.Type ||
              col.Type == "default" ||
              col.Type == "phone" ||
              col.Type == "email") &&
            item[col.Id]?.indexOf(this.state.keySearch) >= 0
          ) {
            return true;
          }

          if (col.Type == "combobox") {
            const _value = col.DataSource?.find(
              (x) => x[col.FieldId || col.Id] == item[col.Id]
            )?.[col.FieldName || col.FieldId || col.Id];
            if (_value && _value?.indexOf(this.state.keySearch) >= 0) {
              return true;
            }
          }
        }
      }
      return true;
    });

    result = result.filter((item) => {
      if (this.state.filters.length) {
        for (let j = 0; j < this.state.filters.length; j++) {
          const filter = this.state.filters[j];
          if (filter) {
            const col = this.columns.find((x) => x.Id == filter.Id);
            if (col) {
              switch (col.Type) {
                case "check":
                  if (filter.Value != undefined && filter.Value !== "__all__") {
                    if ((item[col.Id] ? true : false) != filter.Value) {
                      return false;
                    }
                  }
                case "combobox":
                  if (filter.Value != undefined && filter.Value !== "__all__") {
                    if (item[col.Id] != filter.Value) {
                      return false;
                    }
                  }
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
      return true;
    });

    this.setState({
      singlePageInfo: {
        countItem: result?.length || (0 as any),
        totalItem: datas?.length || (0 as any),
      },
    });
    return result;
  }

  public initToolbar(): IToolbar[] {
    return [
      {
        id: "FILTER",
        text: "Filter",
        disabled: false,
        class: "btn btn-view",
        iconKey: "filter",
      },
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
          content: `Bạn muốn xóa ${this.title?.toLowerCase()} <strong>${
            this.rowSelected?.row[this.fieldName]
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
    if (this.showSinglePageInfo) {
      return this.localFilter(res?.data || []);
    }
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
    });
  }

  async onKeyDown(e: KeyboardEvent) {
    try {
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (["q", "e", "r", "d", "s"].indexOf(key) >= 0) {
          switch (key) {
            //Thêm mới
            case "q":
              e.preventDefault();
              this.add();
              break;
            //Thêm sửa
            case "e":
              e.preventDefault();
              this.edit();
              break;
            //Sao
            case "r":
              e.preventDefault();
              this.duplicate();
              break;
            //Xóa
            case "d":
              const toolbar = this.initToolbar();
              if (toolbar.find((x) => x.iconKey == "delete")) {
                e.preventDefault();
                this.delete();
              }
              break;
          }
        }
      }
    } catch (error) {}
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

  timoutFilter: any;

  renderFilterControl(col: IColumn) {
    switch (col.Type) {
      case "check":
        return <CheckBox name={col.Id} />;
      default:
        return <TextBox name={col.Id} />;
    }
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
          {this.showSearchBar ? (
            <div className="search-bar">
              <TextBox
                name="keysearch"
                placeholder={this.searchBarPlaholder}
                onChange={(e, ctr, v) => {
                  if (v != this.state.keySearch) {
                    if (this.timoutFilter) {
                      clearTimeout(this.timoutFilter);
                    }
                    this.timoutFilter = setTimeout(async () => {
                      this.setState({
                        keySearch: v,
                      });
                      this.setState({ datas: (await this.loadData()) || [] });
                      this.timoutFilter = undefined;
                    }, 500);
                  }
                }}
              />
              <IconSvg iconKeys="search" />
            </div>
          ) : null}
          {this.state.toolbars?.length ? (
            <div className="toolbar">
              {this.state.toolbars.map((btn, idx) => {
                if (btn.id == "FILTER") {
                  return (
                    <button
                      key={idx}
                      className={buildClass(["bt-filter", btn.class])}
                      type="button"
                      ref={this.btFilterRef}
                    >
                      {btn.iconKey ? (
                        <IconSvg
                          className={btn.iconCls}
                          iconKeys={btn.iconKey}
                        />
                      ) : null}
                      <span>{btn.text}</span>
                    </button>
                  );
                }
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
              localSinglePageInfo={
                this.showSinglePageInfo ? this.state.singlePageInfo : undefined
              }
            />
          </div>
        </div>
        {this.renderDetail()}
        {this.state.toolbars?.find((x) => x.id == "FILTER") ? (
          <FilterDropDown
            parentRef={this.btFilterRef}
            columns={this.columns}
            values={this.state.filters}
            changedFilter={(v) => {
              this.setState({
                filters: v,
              });

              setTimeout(async () => {
                this.setState({
                  datas: await this.loadData(),
                });
              });
            }}
          />
        ) : null}
      </>
    );
  }
}
export default DictBaseListing;
