import Error from "@/components/share/Error/error";
const ErrorPage = () => {
  return <Error statusCode={404} rootPath="/admin" />;
};
export default ErrorPage;
