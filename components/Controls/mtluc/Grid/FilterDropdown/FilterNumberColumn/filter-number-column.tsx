import React, { useState } from "react";
import ComboBox from "../../../Form/Combobox/combobox";
import Numeric from "../../../Form/Numeric/numeric";
import { IColumn } from "../../Column/column";
import { IFilter } from "../filter.interface";

export interface IFilterNumberColumn {
  col: IColumn;
  value?: IFilter;
  onChange?: (v: IFilter) => void;
}

const operator = [
  {
    id: "eq",
    name: "Bằng",
  },
  {
    id: "neq",
    name: "Khác",
  },
  {
    id: ">",
    name: "Lớn hơn",
  },
  {
    id: ">",
    name: "Nhỏ hơn",
  },
];

const FilterNumberColumn = ({ col, value, onChange }: IFilterNumberColumn) => {
  const [filter, setFilter] = useState(value || ({} as IFilter));

  return (
    <React.Fragment key={`filter_ctr_${col.Id}`}>
      <td className="filter-op-col">
        <ComboBox
          name={`filter_op_${col.Id}`}
          dataSource={operator}
          fieldId="id"
          fieldName="name"
          defaultValue={"eq"}
          className="col-12"
          onMouseDownPopup={(e) => {
            e.stopPropagation();
          }}
          value={filter.Operator}
          onChange={(e, ctr, v) => {
            setFilter({
              ...filter,
              Operator: v,
            });
            onChange?.({
              ...filter,
              Operator: v,
            });
          }}
          unFreeText
        />
      </td>
      <td>
        <Numeric
          name={`filter_ctr_${col.Id}`}
          className={"filte-col-control"}
          format={col.Format}
          creaseButton="none"
          value={filter.Value}
          onChange={(e, ctr, v) => {
            setFilter({
              ...filter,
              Value: v,
            });
            onChange?.({
              ...filter,
              Value: v,
            });
          }}
        />
      </td>
    </React.Fragment>
  );
};
export default FilterNumberColumn;
