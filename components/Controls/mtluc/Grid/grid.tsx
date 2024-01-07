import { MouseEvent, PureComponent, RefObject, createRef } from "react";
import EmptyRow from "../EmptyRow/empty-row";
import ComboBox from "../Form/Combobox/combobox";
import Numeric from "../Form/Numeric/numeric";
import { buildClass, formatNumber } from "../base/common";
import Cell from "./Cell/cell";
import CellHeader from "./Cell/cell-header";
import { IColumn } from "./Column/column";

interface IGridProps {
  columns?: IColumn[];
  showIndexCol?: boolean;
  localSinglePageInfo?: {
    countItem: number;
    totalItem: number;
  };
  datas: any[];
  onCellClick?: (
    e: MouseEvent,
    row: any,
    col: any,
    rowIdx: number
  ) => void | Promise<void>;
  onCellDoubleClick?: (
    e: MouseEvent,
    row: any,
    col: any,
    rowIdx: number
  ) => void | Promise<void>;
  onRowClick?: (
    e: MouseEvent,
    row: any,
    rowIdx: number
  ) => void | Promise<void>;
  onRowDoubleClick?: (
    e: MouseEvent,
    row: any,
    rowIdx: number
  ) => void | Promise<void>;
  onContextMenu?: (e: MouseEvent) => void | Promise<void>;
  paper?: IGridPaper;
  onFilterChange?: (paper: IGridPaper) => void;
  responsive?: boolean
  colMobileActions?: (row: any, rowIdx: number) => React.ReactNode
}

export interface IGridPaper {
  pageIndex: number;
  totalItemCount: number;
  pageSize: number;
  pageCount: number;
}

interface IGridState {
  itemSelected?: {
    row: any;
    idx: number;
  };
  paper?: IGridPaper;
}

class Grid extends PureComponent<IGridProps, IGridState> {
  headerRef!: RefObject<HTMLDivElement>;

  get rowSelected() {
    return this.state.itemSelected;
  }

  set rowSelected(row: { row: any; idx: number } | undefined) {
    this.setState({
      itemSelected: row,
    });
  }

  static defaultProps = {
    responsive: true
  }

  constructor(props: IGridProps) {
    super(props);
    this.headerRef = createRef<HTMLDivElement>();
    this.state = {
      itemSelected: undefined,
      paper: props.paper,
    };
  }

  static getDerivedStateFromProps(props: IGridProps, state: IGridState) {
    if (props.paper !== state.paper) {
      let paper = props.paper;
      if (paper && (!paper.pageIndex || paper.pageIndex <= 0)) {
        paper.pageIndex = 1;
      }
      return {
        ...state,
        paper: paper,
      };
    }
    return null;
  }

  handlerBodyScroll(e: any) {
    if (this.headerRef.current)
      this.headerRef.current.scrollLeft = (
        e.target as HTMLDivElement
      ).scrollLeft;
  }

  handlerRowClick(e: MouseEvent, row: any, rowIdx: number) {
    if (this.state.itemSelected?.row !== row) {
      this.setState({
        itemSelected: {
          row: row,
          idx: rowIdx,
        },
      });
    }
    this.props.onRowClick?.(e, row, rowIdx);
  }

  setFilter(filter: {
    pageIndex?: number;
    totalItemCount?: number;
    pageSize?: number;
    pageCount?: number;
  }) {
    this.setState({ paper: { ...this.state.paper, ...(filter as any) } });
    this.props?.onFilterChange?.({
      ...this.state.paper,
      ...(filter as any),
    });
  }
  render() {
    const ColumnIdx =
      this.props.showIndexCol === false
        ? undefined
        : ({
          Id: "_INDEX_",
          Title: "STT",
          ClassName: "text-center col-index",
          MinWidth: 80,
          MaxWidth: 80,
          renderCell(row, Id, rowIdx) {
            return rowIdx + 1;
          },
        } as IColumn);

    return (
      <div className={buildClass(["mtl-grid", this.props.responsive ? 'grid-mobile' : ''])}>
        {
          this.props.responsive ? <style>
            {
              this.props.columns?.map((col, idx) => {
                return `.mtl-grid.grid-mobile .mtl-cell-data:nth-of-type(${idx + (ColumnIdx ? 2 : 1)}):before { content: "${col.Title}:"; }`
              })
            }
          </style> : null
        }

        <div className="mtl-grid-header">
          <div className="mtl-grid-header-container" ref={this.headerRef}>
            <div className="mtl-header-row">
              {ColumnIdx ? <CellHeader Column={ColumnIdx} /> : null}
              {this.props.columns?.map((col) => {
                return <CellHeader key={col.Id} Column={col} />;
              })}
            </div>
          </div>
        </div>
        <div
          className={"mtl-grid-body"}
          onScroll={this.handlerBodyScroll.bind(this)}
          onContextMenu={this.props.onContextMenu}
        >
          {this.props?.datas?.length ? (
            this.props?.datas?.map((row, idx) => {
              return (
                <div key={idx} className={"mtl-grid-row-data-wap"}>
                  <div
                    className={buildClass([
                      "mtl-grid-row-data",
                      idx === this.state.itemSelected?.idx ? "row-selected" : "",
                    ])}
                    onClick={(e) => this.handlerRowClick(e, row, idx)}
                    onDoubleClick={(e) => {
                      this.props.onRowDoubleClick?.(e, row, idx);
                    }}
                  >
                    {ColumnIdx ? (
                      <Cell
                        Column={ColumnIdx}
                        Row={row}
                        ColIdx={0}
                        RowIdx={idx}
                      />
                    ) : null}
                    {this.props.columns?.map((col, colIdx) => {
                      return (
                        <Cell
                          key={col.Id + "_" + idx}
                          Column={col}
                          Row={row}
                          ColIdx={colIdx}
                          RowIdx={idx}
                        />
                      );
                    })}
                  </div>
                  {
                    this.props.responsive ? <div className="tool-bar-mobile">
                      {
                        this.props.colMobileActions?.(row, idx)
                      }
                    </div> : null
                  }

                </div>
              );
            })
          ) : (
            <>
              <div className={buildClass(["mtl-grid-row-data row-empty"])}>
                {this.props.columns?.map((col, colIdx) => {
                  return (
                    <Cell
                      key={"ROW_EMPTY_" + colIdx}
                      Column={{
                        ...col,
                        renderCell(row, Id, rowIdx) {
                          return "";
                        },
                      }}
                      Row={{}}
                      ColIdx={colIdx}
                      RowIdx={-1}
                    />
                  );
                })}
              </div>
              <EmptyRow title="Trống" />
            </>
          )}
        </div>
        {this.state.paper ? (
          <div className="mtl-grid-paper">
            <div>
              <button
                className="btn btn-back-first"
                title="Trang đầu"
                disabled={this.state.paper.pageIndex == 1}
                onClick={() => {
                  this.setFilter({ pageIndex: 1 });
                }}
              >
                <i className="fa fa-angle-double-left"></i>
              </button>
              <button
                className="btn btn-back"
                title="Trang trước"
                disabled={this.state.paper.pageIndex == 1}
                onClick={() => {
                  this.setFilter({
                    pageIndex: (this.state.paper?.pageIndex || 1) - 1,
                  });
                }}
              >
                <i className="fa fa-angle-left"></i>
              </button>
            </div>
            <div className="mtl-grid-paper-index">
              <Numeric
                className="page-index"
                name="pageIndex"
                creaseButton="none"
                format="0"
                value={this.state.paper.pageIndex || 1}
                min={1}
                max={this.state.paper.pageCount || 1}
                onChange={(e, ctr, v) => {
                  if (!ctr.validate(v) && v != this.state.paper?.pageIndex) {
                    this.setFilter({ pageIndex: v });
                  }
                }}
              />
            </div>
            <div>
              &nbsp;/&nbsp;{this.state.paper.pageCount || 1}&nbsp;Trang&nbsp;
            </div>
            <div>
              <button
                className="btn btn-next"
                title="Trang sau"
                disabled={
                  this.state.paper.pageCount == this.state.paper.pageIndex
                }
                onClick={() => {
                  this.setFilter({
                    pageIndex: (this.state.paper?.pageIndex || 0) + 1,
                  });
                }}
              >
                <i className="fa fa-angle-right"></i>
              </button>
              <button
                className="btn btn-next-last"
                title="Trang cuối"
                disabled={
                  this.state.paper.pageCount == this.state.paper.pageIndex
                }
                onClick={() => {
                  this.setFilter({
                    pageIndex: this.state.paper?.pageCount || 1,
                  });
                }}
              >
                <i className="fa fa-angle-double-right"></i>
              </button>
            </div>
            <div>
              <ComboBox
                className="page-size"
                name="pageSize"
                fieldId="id"
                value={this.state.paper.pageSize || 50}
                required
                dataSource={[{ id: 25 }, { id: 50 }, { id: 100 }]}
                onChange={(e, ctr, v, opt) => {
                  if (opt?.row && opt.row.id != this.state.paper?.pageSize) {
                    this.setFilter({ pageSize: opt.row.id });
                  }
                }}
              />
            </div>
            <div className="flex-1"></div>
            <div>
              Từ{" "}
              {formatNumber(
                (this.state.paper.pageIndex - 1) * this.state.paper.pageSize +
                (this.props?.datas?.length ? 1 : 0),
                0
              )}{" "}
              đến{" "}
              {formatNumber(
                (this.state.paper.pageIndex - 1) * this.state.paper.pageSize +
                (this.props?.datas?.length || 0),
                0
              )}{" "}
              trên {formatNumber(this.state?.paper?.totalItemCount, 0)} dòng
            </div>
          </div>
        ) : this.props.localSinglePageInfo ? (
          <div className="mtl-grid-paper">
            <div>Tổng số</div>
            <div className="flex-1"></div>
            <div>
              {formatNumber(this.props.localSinglePageInfo.countItem || 0, 0)} /{" "}
              {formatNumber(this.props.localSinglePageInfo.totalItem || 0, 0)}{" "}
              bản ghi
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default Grid;
