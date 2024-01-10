import { NextApiRequest, NextApiResponse } from "next";
import { BaseBl } from "../Bl/base-bl";
import { ISession } from "../session";
import { Auth, IAuth } from "./auth";

export abstract class BaseApi<T extends BaseBl<any>> {
  query: any;
  body: any;
  action?: string;
  session?: ISession;
  auth!: IAuth;

  constructor(
    public req: NextApiRequest,
    public res: NextApiResponse<any>,
    public _bl: T
  ) {
    this.query = req.query;
    this.body = req.body;
    this.action = (req.query?.action as string)?.toLowerCase();
    this.session = this.req?.session as any as ISession;
  }

  protected checkAuthSession() {
    if (!this.session?.user?.FullName) {
      throw {
        code: "unauth",
        message: "Phiên làm việc hết hạn",
      };
    }
  }

  protected checkAuth() {
    this.auth = Auth.getToken(this.req.headers.authorization || "");
    this._bl.auth = this.auth;
  }

  async get() {
    this.processMethodNotAllowed();
  }

  async post() {
    this.processMethodNotAllowed();
  }

  async put() {
    this.processMethodNotAllowed();
  }

  async delete() {
    this.processMethodNotAllowed();
  }

  processError(error: any) {
    if (error?.code == "unauth") {
      this.res.status(401).json(error);
    } else {
      this.res.status(400).json(error);
    }

    console.log(error);
  }

  processMethodNotAllowed() {
    this.res.status(405).send({ error: "Method Not Allowed" });
  }

  run() {
    if (this.action) {
      const actionName = [
        ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)),
        ...Object.getOwnPropertyNames(BaseApi.prototype),
      ].find(
        (x) =>
          typeof (this as any)[x] == "function" &&
          x.toLowerCase() == this.action
      );
      if (actionName) {
        (this as any)[actionName]();
      } else {
        this.res
          .status(404)
          .send({ error: "Request did not match any routes" });
      }
    } else {
      switch (this.req.method) {
        case "GET":
          this.get();
          break;
        case "POST":
          this.post();
          break;
        case "PUT":
          this.put();
          break;
        case "DELETE":
          this.delete();
          break;
      }
    }
  }
}
