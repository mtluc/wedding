import Error from "@/components/share/Error/error";
import { NextPage } from "next";

/**
 * Trang lỗi
 * @param param0 mã lỗi
 * @returns
 */
const ErrorPage: NextPage<{ statusCode: number }> = ({ statusCode }) => {
  return <Error statusCode={statusCode}></Error>;
};

/**
 * Initial Props
 * Lấy statusCode
 * @param param0
 * @returns
 */
ErrorPage.getInitialProps = async (context) => {
  return {
    statusCode: context?.res?.statusCode || context?.err?.statusCode || 404,
  };
};

export default ErrorPage;
