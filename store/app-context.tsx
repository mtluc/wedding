import { User } from "@/model/User/User";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

export interface IAppContext {
  user?: User;
  setUser?: Dispatch<SetStateAction<User>>;
  isSession: Boolean;
}
const AppContext = createContext({
  user: undefined,
  isSession: false,
} as IAppContext);
export default AppContext;

export const useAppStore = () => {
  const context = useContext(AppContext);
  return context;
};
