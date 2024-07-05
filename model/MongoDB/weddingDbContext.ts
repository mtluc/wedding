import { DBContext } from "./context";

const user: string = "tienluc0811";
const pass: string = "UlPQGb34u11jlKXz";
const uri: string =
  "mongodb+srv://[USER_NAME]:[PASS]@cluster0.dpevir0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName: string = "Wedding";

export class BaseDb extends DBContext {
  constructor() {
    super(uri.replace("[USER_NAME]", user).replace("[PASS]", pass), dbName);
  }
}
export const weddingDb = new BaseDb();
