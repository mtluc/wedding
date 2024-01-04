import Error from "@/components/share/Error/error";
import { NextPage } from "next";

const Error503: NextPage = () => {
  return <Error statusCode={503}></Error>;
};
export default Error503;
