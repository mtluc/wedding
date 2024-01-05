import { NextApiRequest, NextApiResponse } from "next";
import { BaseBl } from "../Bl/base-bl";
import { ISession } from "../session";

export abstract class BaseApi<T extends BaseBl<any>> {
  query: any;
  body: any;
  action?: string;
  session?: ISession;

  constructor(
    public req: NextApiRequest,
    public res: NextApiResponse<any>,
    public _bl: T
  ) {
    this.query = req.query;
    this.body = req.body;
    this.action = (req.query?.action as string)?.toLowerCase();
    this.session = this.req?.session as any as ISession;
    _bl.session = this.session;
  }

  protected checkAuth() {
    if (!this.session?.user?.FullName) {
      throw {
        code: "unauth",
        message: "Phiên làm việc hết hạn",
      };
    }
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
