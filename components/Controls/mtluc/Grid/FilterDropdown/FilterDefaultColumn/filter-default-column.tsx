import React, { useState } from "react";
import ComboBox from "../../../Form/Combobox/combobox";
import TextBox from "../../../Form/Textbox/textbox";
import { IColumn } from "../../Column/column";
import { IFilter } from "../filter.interface";

export interface IFilterDefaultColumn {
  col: IColumn;
  value?: IFilter;
  onChange?: (v: IFilter) => void;
}

const operator = [
  {
    id: "like",
    name: "Chứa",
  },
  {
    id: "nlike",
    name: "Không chứa",
  },
  {
    id: "eq",
    name: "Bằng",
  },
  {
    id: "neq",
    name: "Khác",
  },
];

const FilterDefaultColumn = ({
  col,
  value,
  onChange,
}: IFilterDefaultColumn) => {
  const [filter, setFilter] = useState(value || ({} as IFilter));
  return (
    <React.Fragment key={`filter_ctr_${col.Id}`}>
      <td className="filter-op-col">
        <ComboBox
          name={`filter_op_${col.Id}`}
          dataSource={operator}
          fieldId="id"
          fieldName="name"
          defaultValue={"like"}
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
        <TextBox
          name={`filter_ctr_${col.Id}`}
          className={"filte-col-control"}
          placeholder="Nhập giá trị lọc"
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
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      </td>
    </React.Fragment>
  );
};
export default FilterDefaultColumn;
