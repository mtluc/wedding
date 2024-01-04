import Error from "@/components/share/Error/error";
import { NextPage } from "next";

const Error500: NextPage = () => {
  return <Error statusCode={500}></Error>;
};
export default Error500;
