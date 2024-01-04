import { Component } from "react";
import { IColumn } from "../Column/column";
import { buildClass } from "../../base/common";
export interface ICellHeaderProps {
  Column: IColumn;
}

export interface ICellHeaderState {}

class CellHeader extends Component<ICellHeaderProps, ICellHeaderState> {
  constructor(props: ICellHeaderProps) {
    super(props);
    this.state = {};
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
    nextProps: Readonly<ICellHeaderProps>,
    nextState: Readonly<ICellHeaderState>,
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

    if (this.Col.Width !== nextProps.Column.Width) {
      return true;
    }

    if (this.Col.Title !== nextProps.Column.Title) {
      return true;
    }

    if (this.Col.ClassName !== nextProps.Column.ClassName) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div
        className={buildClass([
          "mtl-cell-header",
          this.Col.Docked ? "col-docked" : "",
          this.className,
        ])}
        key={this.Col.Id}
        style={{
          minWidth: this.minWidth,
          maxWidth: this.maxWidth,
          flex: this.width,
        }}
      >
        <div className="mtl-cell-header-content">
          {this.Col.Title || this.Col.Id}
        </div>
      </div>
    );
  }
}
export default CellHeader;
