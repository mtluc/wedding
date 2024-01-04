import { PureComponent } from "react";
import Numeric from "../Form/Numeric/numeric";
import ComboBox from "../Form/Combobox/combobox";

export interface IParer {
  pageIndex: number;
  totalItemCount: number;
  pageSize: number;
  pageCount: number;
}

interface IPaperProps {
  pageIndex: number;
  totalItemCount: number;
  pageSize: number;
  pageCount: number;
  dataLenght: number;
  onFilterChange?: (paper: IParer) => void;
}

interface IPaperState {}

class Paper extends PureComponent<IPaperProps, IPaperState> {
  setFilter(filter: {
    pageIndex?: number;
    totalItemCount?: number;
    pageSize?: number;
    pageCount?: number;
  }) {
    this.props?.onFilterChange?.({
      pageIndex: this.props.pageIndex,
      totalItemCount: this.props.totalItemCount,
      pageSize: this.props.pageSize,
      pageCount: this.props.pageCount,
      ...(filter as any),
    });
  }
  render() {
    return (
      <div className="mtl-paper">
        <div className="page-size-op">
          <div className="mtl-page-size-flex"></div>
          <div>
            <button
              className="btn btn-back-first"
              title="Trang đầu"
              disabled={this.props.pageIndex == 1}
              onClick={() => {
                this.setFilter({ pageIndex: 1 });
              }}
            >
              <i className="fa fa-angle-double-left"></i>
            </button>
            <button
              className="btn btn-back"
              title="Trang trước"
              disabled={this.props.pageIndex == 1}
              onClick={() => {
                this.setFilter({
                  pageIndex: (this.props?.pageIndex || 1) - 1,
                });
              }}
            >
              <i className="fa fa-angle-left"></i>
            </button>
          </div>
          <div className="mtl-paper-index">
            <Numeric
              className="page-index"
              name="pageIndex"
              creaseButton="none"
              format="0"
              value={this.props.pageIndex || 1}
              min={1}
              max={this.props.pageCount || 1}
              onChange={(e, ctr, v) => {
                if (!ctr.validate(v) && v != this.props?.pageIndex) {
                  this.setFilter({ pageIndex: v });
                }
              }}
            />
          </div>
          <div>&nbsp;/&nbsp;{this.props.pageCount || 1}&nbsp;Trang&nbsp;</div>
          <div>
            <button
              className="btn btn-next"
              title="Trang sau"
              disabled={this.props.pageCount == this.props.pageIndex}
              onClick={() => {
                this.setFilter({
                  pageIndex: (this.props?.pageIndex || 0) + 1,
                });
              }}
            >
              <i className="fa fa-angle-right"></i>
            </button>
            <button
              className="btn btn-next-last"
              title="Trang cuối"
              disabled={this.props.pageCount == this.props.pageIndex}
              onClick={() => {
                this.setFilter({
                  pageIndex: this.props?.pageCount || 1,
                });
              }}
            >
              <i className="fa fa-angle-double-right"></i>
            </button>
          </div>
          <div className="page-size-wap">
            <ComboBox
              className="page-size"
              name="pageSize"
              fieldId="id"
              value={this.props.pageSize || 50}
              required
              dataSource={[{ id: 25 }, { id: 50 }, { id: 100 }]}
              onChange={(e, ctr, v, opt) => {
                if (opt?.row && opt.row.id != this.props?.pageSize) {
                  this.setFilter({ pageSize: opt.row.id });
                }
              }}
            />
          </div>
          <div className="mtl-page-size-flex"></div>
        </div>
        <div className="total-info">
          Từ{" "}
          {(this.props.pageIndex - 1) * this.props.pageSize +
            (this.props?.dataLenght ? 1 : 0)}{" "}
          đến{" "}
          {(this.props.pageIndex - 1) * this.props.pageSize +
            (this.props?.dataLenght || 0)}{" "}
          trên {this.props.totalItemCount} dòng
        </div>
      </div>
    );
  }
}
export default Paper;
