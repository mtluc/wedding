import { RefObject, useMemo, useState } from "react";
import { DropDown } from "../../Dropdown/dropdown";
import { buildClass, fireMouseDown } from "../../base/common";
import { IColumn } from "../Column/column";
import FilterCheckColumn from "./FilterCheckColumn/filter-check-column";
import FilterDefaultColumn from "./FilterDefaultColumn/filter-default-column";
import classNames from "./filter-dropdown.module.scss";
import FilterComboColumn from "./FilterComboColumn/filter-combo-column";
import IconSvg from "../../icon/icon-svg";
import FilterNumberColumn from "./FilterNumberColumn/filter-number-column";
import { IFilter } from "./filter.interface";

export interface IFilterProps {
  columns: IColumn[];
  parentRef: RefObject<any>;
  isShow?: boolean;
  values?: IFilter[];
  changedFilter?: (filters: IFilter[]) => void;
}
const FilterDropDown = ({
  parentRef,
  columns,
  isShow,
  values,
  changedFilter,
}: IFilterProps) => {
  const [_filters, setFilters] = useState(values || ([] as IFilter[]));

  const getDefaultOp = (col: IColumn) => {
    switch (col.Type) {
      case "check":
      case "combobox":
      case "number":
        return "eq";
      default:
        return "like";
    }
  };

  const filters = useMemo(() => {
    const result = [] as IFilter[];
    columns.map((col) => {
      result.push({
        Id: col.Id,
        Operator:
          _filters?.find((x) => x.Id == col.Id)?.Operator || getDefaultOp(col),
        Value: _filters?.find((x) => x.Id == col.Id)?.Value,
      });
    });
    return result;
  }, [_filters, columns]);

  const renderControl = (col: IColumn) => {
    switch (col.Type) {
      case "check":
        return (
          <FilterCheckColumn
            col={col}
            value={filters?.find((x) => x.Id == col.Id)}
            onChange={(v) => {
              const record = filters.find((x) => x.Id == v.Id);
              if (record) {
                Object.assign(record, v);
                setFilters([...filters]);
              }
            }}
          />
        );
      case "combobox":
        return (
          <FilterComboColumn
            col={col}
            value={filters?.find((x) => x.Id == col.Id)}
            onChange={(v) => {
              const record = filters.find((x) => x.Id == v.Id);
              if (record) {
                Object.assign(record, v);
                setFilters([...filters]);
              }
            }}
          />
        );
      case "number":
        return (
          <FilterNumberColumn
            col={col}
            value={filters?.find((x) => x.Id == col.Id)}
            onChange={(v) => {
              const record = filters.find((x) => x.Id == v.Id);
              if (record) {
                Object.assign(record, v);
                setFilters([...filters]);
              }
            }}
          />
        );
      default:
        return (
          <FilterDefaultColumn
            col={col}
            value={filters?.find((x) => x.Id == col.Id)}
            onChange={(v) => {
              const record = filters.find((x) => x.Id == v.Id);
              if (record) {
                Object.assign(record, v);
                setFilters([...filters]);
              }
            }}
          />
        );
    }
  };
  return (
    <DropDown parentRef={parentRef} isShow={isShow}>
      <div className={classNames.wap}>
        <div className={buildClass(["custom-scroll", classNames.list])}>
          <table>
            <tbody>
              {columns?.map((col) => {
                return (
                  <tr key={`row_${col.Id}`}>
                    <td className={classNames.col_lable}>
                      <label htmlFor={`filter_ctr_${col.Id}`}>
                        {col.Title}
                      </label>
                    </td>
                    {renderControl(col)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={classNames.task_bar}>
          <button
            onClick={(e) => {
              changedFilter?.(filters);
              fireMouseDown();
            }}
          >
            <IconSvg iconKeys="search" />
            <span>Lọc</span>
          </button>
          <button
            className="btn btn-danger"
            onClick={(e) => {
              setFilters([]);
              changedFilter?.([]);
              fireMouseDown();
            }}
          >
            <IconSvg iconKeys="close" />
            <span>Hủy lọc</span>
          </button>
        </div>
      </div>
    </DropDown>
  );
};

export default FilterDropDown;
