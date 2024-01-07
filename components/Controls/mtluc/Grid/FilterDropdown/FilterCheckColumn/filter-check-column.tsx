import React, { useState } from "react";
import ComboBox from "../../../Form/Combobox/combobox";
import { IColumn } from "../../Column/column";
import { IFilter } from "../filter.interface";

export interface IFilterCheckColumn {
  col: IColumn;
  value?: IFilter;
  onChange?: (v: IFilter) => void;
}

const values = [
  {
    id: "__all__",
    name: "Tất cả",
  },
  {
    id: true,
    name: "Có",
  },
  {
    id: false,
    name: "Không",
  },
];

const FilterCheckColumn = ({ col, value, onChange }: IFilterCheckColumn) => {
  const [filter, setFilter] = useState(value || ({} as IFilter));

  return (
    <React.Fragment key={`filter_ctr_${col.Id}`}>
      <td />
      <td className={"filte-col-control"}>
        <ComboBox
          name={`filter_ctr_${col.Id}`}
          className="col-12"
          onMouseDownPopup={(e) => {
            e.stopPropagation();
          }}
          unFreeText
          dataSource={values}
          fieldId="id"
          fieldName="name"
          defaultValue={"__all__"}
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
export default FilterCheckColumn;
