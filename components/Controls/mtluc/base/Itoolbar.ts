import { IconKeys } from "../icon/icon-svg";

export interface IToolbar {
  id: string;
  text: string;
  disabled?: boolean;
  class?: string;
  iconCls?: string;
  iconKey?: IconKeys;
  responsive?: boolean;
}
