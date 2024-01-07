import { Component, MouseEvent } from "react";
import { IColumn } from "../Column/column";
import {
  buildClass,
  formatDate,
  formatNumber,
  parseDate,
} from "../../base/common";
import CheckBox from "../../Form/Checkbox/checkbox";

export interface ICellProps {
  Column: IColumn;
  Row: any;
  ColIdx: number;
  RowIdx: number;
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
}
export interface ICellState {}

class Cell extends Component<ICellProps, ICellState> {
  get col() {
    return this.props.Column;
  }

  get Col() {
    return this.props.Column;
  }

  get minWidth() {
    return this.Col.MinWidth || 100;
  }

  get maxWidth() {
    return this.Col.MaxWidth;
  }

  get width() {
    return this.Col.Width || 100;
  }

  get className() {
    return this.Col.ClassName;
  }

  shouldComponentUpdate(
    nextProps: Readonly<ICellProps>,
    nextState: Readonly<ICellState>,
    nextContext: any
  ): boolean {
    if (this.Col.Id !== nextProps.Column.Id) {
      return true;
    }
    if (this.Col.MaxWidth !== nextProps.Column.MaxWidth) {
      return true;
    }

    if (this.Col.MinWidth !== nextProps.Column.MinWidth) {
      return true;
    }

    if (this.Col.ClassName !== nextProps.Column.ClassName) {
      return true;
    }

    if (this.Col.DataSource !== nextProps.Column.DataSource) {
      return true;
    }

    if (
      this.Col.renderCell !== nextProps.Column.renderCell &&
      this.col.Id !== "_INDEX_"
    ) {
      return true;
    }

    if (this.props.Row !== nextProps.Row) {
      return true;
    }

    if (this.props.RowIdx !== nextProps.RowIdx) {
      return true;
    }

    if (this.props.ColIdx !== nextProps.ColIdx) {
      return true;
    }

    if (this.props.onCellClick !== nextProps.onCellClick) {
      return true;
    }

    if (this.props.onCellDoubleClick !== nextProps.onCellDoubleClick) {
      return true;
    }
    return false;
  }

  render() {
    let cellValue: any = "";
    let className: string = this.col.ClassName || "";
    if (!this.col.renderCell) {
      switch (this.col.Type) {
        case "check":
          cellValue = (
            <CheckBox
              name={`ck_${this.col.Id}_${this.props.RowIdx}`}
              value={this.props.Row[this.col.Id]}
              readonly
            />
          );
          className += " text-center";
          break;
        case "date":
          if (this.props.Row[this.col.Id]) {
            const date = parseDate(this.props.Row[this.col.Id]);
            cellValue = formatDate(date, this.col.Format);
          } else {
            cellValue = "";
          }

          className += " text-center";
          break;
        case "number":
          cellValue = formatNumber(
            this.props.Row[this.col.Id],
            this.col.Format
          );
          className += " text-right";
          break;
        case "combobox":
          if (this.col.DataSource?.length) {
            let fieldId = this.col.FieldId || this.col.Id;
            let fieldName = this.col.FieldName || fieldId;
            let option = this.col.DataSource.find(
              (x) => x[fieldId] === this.props.Row[this.col.Id]
            );
            if (option) {
              cellValue = option[fieldName] || option[fieldId];
            } else {
              cellValue = this.props.Row[this.col.Id]?.toString?.();
            }
          } else {
            cellValue = this.props.Row[this.col.Id]?.toString?.();
          }
          break;
        case "phone":
          cellValue = (
            <a href={`tel:${this.props.Row[this.col.Id]}`}>
              {this.props.Row[this.col.Id]}
            </a>
          );
          break;
        case "email":
          cellValue = (
            <a href={`mailto:${this.props.Row[this.col.Id]}`}>
              {this.props.Row[this.col.Id]}
            </a>
          );
          break;
        default:
          cellValue = this.props.Row[this.col.Id]?.toString?.();
          break;
      }
    }
    return (
      <div
        className={buildClass([
          "mtl-cell-data",
          className,
          this.Col.Docked ? "col-docked" : "",
        ])}
        onClick={(e: MouseEvent) =>
          this.props.onCellClick?.(
            e,
            this.props.Row,
            this.col,
            this.props.RowIdx
          )
        }
        onDoubleClick={(e: MouseEvent) =>
          this.props.onCellDoubleClick?.(
            e,
            this.props.Row,
            this.col,
            this.props.RowIdx
          )
        }
        style={{
          minWidth: this.minWidth,
          maxWidth: this.maxWidth,
          flex: this.width,
        }}
      >
        <div className="mtl-cell-data-content">
          {this.col.renderCell?.(
            this.props.Row,
            this.col.Id,
            this.props.RowIdx
          ) || cellValue}
        </div>
      </div>
    );
  }
}
export default Cell;
