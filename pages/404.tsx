import Error from "@/components/share/Error/error";
import { NextPage } from "next";

const PageNotFound: NextPage = () => {
  return <Error statusCode={404}></Error>;
};
export default PageNotFound;
