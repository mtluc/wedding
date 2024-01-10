import { HttpError } from "@/base/httpClient";
import { devLog } from "@/components/Controls/mtluc/base/common";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const url = `${publicRuntimeConfig.rootApi}${req.url?.replace(
      "/service",
      "/api"
    )}`;
    const httpOption: any = {
      method: req.method,
      headers: {
        origin: req.headers.origin || req.headers.hostname,
        hostname: req.headers.origin || req.headers.hostname,
      },
    };

    httpOption.headers = { ...req.headers };

    if ((req.body && req.method == "POST") || req.method == "PUT") {
      if (req.headers["content-type"]?.toLowerCase() == "application/json") {
        httpOption.body = JSON.stringify(req.body);
      } else {
        httpOption.body = req.body;
      }
    }

    const resClient = await fetch(url, httpOption);

    devLog(url);

    if (resClient.ok) {
      const bold = Buffer.from(await resClient.arrayBuffer());
      Array.from(resClient.headers.keys()).forEach((key) => {
        if(key.toLowerCase() == 'content-length'){
            res.setHeader(key, bold.length);
        }else{
            res.setHeader(key, resClient.headers.get(key) || "");
        }
      });
      res.status(200).send(bold);
    } else {
      console.error("error", url);
      const text = await resClient.text();

      let error: any = "";
      try {
        error = JSON.parse(text);
        if (error.errors) {
          if (typeof error.errors === "object") {
            let strError = "";

            for (const key in error.errors) {
              if (Object.prototype.hasOwnProperty.call(error.errors, key)) {
                const errors = error.errors[key];
                strError = (errors as any[])?.join?.("\n") || `\n${errors}`;
              }
            }
            error = strError;
          } else {
            error = error.errors;
          }
        } else if (error.message) {
          error = error.message;
        }
      } catch (error) {
        error = text;
      }
      throw {
        statusCode: resClient.status,
        error: error,
        message: error.message || text,
      } as HttpError;
    }
  } catch (error: any) {
    res.status(error?.statusCode || 400).json(error);
  }
}
