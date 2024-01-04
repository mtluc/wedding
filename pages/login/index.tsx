import { NextPage } from "next";
import Head from "next/head";
import classNames from "./index.module.scss";
import Form from "@/components/Controls/mtluc/Form/form";
import TextBox from "@/components/Controls/mtluc/Form/Textbox/textbox";
import { FormEvent, useEffect, useState } from "react";
import {
  handlerRequertException,
  setAppLoading,
} from "@/components/Controls/mtluc/base/common";
import { httpClient } from "@/base/httpClient";
import { User } from "@/model/User/User";
import { ISession, withSessionSsr } from "@/base/session";

export const getServerSideProps = withSessionSsr(
  async ({ req, res, query }) => {
    const session = req.session as any as ISession;
    return {
      props: {
        session: session || null,
        query: query || null,
      },
    };
  }
);
const LoginPage: NextPage = (props: { session?: ISession; query?: any }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (props.session?.user?.UserName) {
      location.href = props.query?.forward || "/admin";
    } else {
      setShow(true);
    }
  }, [props?.query, props.session?.user?.UserName]);

  const handlerSubmit = async (e: FormEvent, value: any) => {
    e.preventDefault();
    try {
      setAppLoading(true);
      const res = await httpClient.postJson<User>("/api/system/login", {
        ...value,
      });
      location.href = props.query?.forward || "/admin";
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
