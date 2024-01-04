import { ParsedUrlQuery } from "querystring";

export interface BaseProps {
  children?: React.ReactNode;
  query?: ParsedUrlQuery;
}
