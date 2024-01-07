import React, { useState } from "react";
import ComboBox from "../../../Form/Combobox/combobox";
import { IColumn } from "../../Column/column";
import { IFilter } from "../filter.interface";

export interface IFilterComboColumn {
  col: IColumn;
  value?: IFilter;
  onChange?: (v: IFilter) => void;
}

const FilterComboColumn = ({ col, value, onChange }: IFilterComboColumn) => {
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
          dataSource={[
            {
              [col.FieldId || col.Id]: "__all__",
              [col.FieldName || col.Id]: "Tất cả",
            },
            ...(col.DataSource || []),
          ]}
          fieldId={col.FieldId}
          fieldName={col.FieldName}
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
export default FilterComboColumn;
