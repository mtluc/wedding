import { IAuth } from "@/base/api/auth";
import { httpClient } from "@/base/httpClient";
import TextBox from "@/components/Controls/mtluc/Form/Textbox/textbox";
import Form from "@/components/Controls/mtluc/Form/form";
import {
  getLocalAuth,
  getQueryUrl,
  handlerRequertException,
  setAppLoading,
} from "@/components/Controls/mtluc/base/common";
import { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import classNames from "./index.module.scss";

const LoginPage: NextPage = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const auth = getLocalAuth();
    const { forward } = getQueryUrl();
    if (
      auth?.expiredAt &&
      auth?.token &&
      auth.expiredAt > new Date().getTime()
    ) {
      location.href = forward || "/admin";
    } else {
      setShow(true);
    }
  }, []);

  const handlerSubmit = async (e: FormEvent, value: any) => {
    e.preventDefault();
    try {
      setAppLoading(true);
      const { forward } = getQueryUrl();
      const res = await httpClient.postJson<IAuth>(
        httpClient.getUri("/api/system/login"),
        {
          ...value,
        }
      );
      localStorage.setItem(
        "APP_KEY",
        btoa(encodeURIComponent(JSON.stringify(res?.data)))
      );
      localStorage.setItem(
        "TOKEN",
        btoa(
          JSON.stringify(
            res?.data.token
              ?.split(".")?.[1]
              ?.replace(/a/gi, "f")
              .replace(/g/gi, "k")
          )
        )
      );
      location.href = forward || "/admin";
    } catch (error: any) {
      handlerRequertException(error);
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập trang quản trị</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <div className={classNames.login} hidden={!show}>
        <div className={classNames.container}>
          <div className={classNames.main}>
            <Form
              class={classNames.form_login}
              method="POST"
              onSubmit={handlerSubmit}
            >
              <div className={classNames.form_title}>
                <h1 className={classNames.title}>Đăng nhập</h1>
                <div>
                  <span>Đăng nhập vào trang quản trị của bạn</span>
                </div>
              </div>
              <div
                className={[
                  classNames.form_control,
                  classNames.required,
                  classNames.invalid,
                ].join(" ")}
              >
                <label htmlFor="UserName">
                  Tài khoản <span>*</span>
                </label>
                <TextBox
                  placeholder="Nhập tài khoản"
                  name="UserName"
                  required
                />
              </div>
              <div
                className={[classNames.form_control, classNames.required].join(
                  " "
                )}
              >
                <label htmlFor="Password">
                  Mật khẩu <span>*</span>
                </label>
                <TextBox
                  type="password"
                  placeholder="Nhập mật khẩu"
                  name="Password"
                  required
                />
              </div>
              <div className={classNames.form_control}>
                <button
                  className={classNames.btn_submit + " btn-primary-ltr"}
                  type="submit"
                >
                  Đăng nhập
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
