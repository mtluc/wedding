import { IAuth } from "@/base/api/auth";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

export interface IAppContext {
  auth?: IAuth;
  setAuth?: Dispatch<SetStateAction<IAuth>>;
}
const AppContext = createContext({
  auth: undefined,
} as IAppContext);
export default AppContext;

export const useAppStore = () => {
  const context = useContext(AppContext);
  return context;
};
