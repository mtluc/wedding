export interface IColumn {
  Id: string;

  Type?: "date" | "number" | "check" | "combobox" | "default";

  Title?: string;

  ClassName?: string;

  Width?: number;

  MinWidth?: number;

  MaxWidth?: number;

  renderCell?: (row: any, Id: string, rowIdx: number) => any;

  Format?: any;

  /**
   * Data Source dành cho cột combo
   */
  DataSource?: any[];

  FieldId?: string;

  FieldName?: string;

  Docked?: boolean;
}
