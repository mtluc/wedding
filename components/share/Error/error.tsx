import { BaseProps } from "@/base/base-props";
import styles from "./error.module.scss";

export interface ErrorProp extends BaseProps {
  statusCode: number;
  rootPath?: string;
}

const Error = ({ statusCode, rootPath }: ErrorProp) => {
  return (
    <div className={styles.wap}>
      <div className={styles.container}>
        <h1>{statusCode}</h1>
        <span className={styles.description}>
          Trang này đã bị gỡ hoặc không tồn tại!
        </span>
        <div>
          <a
            className={styles.back}
            href="\"
            title="Quay lại"
            onClick={(e) => {
              e.preventDefault();
              if (document.referrer) {
                history.back();
              } else {
                location.href = rootPath || "/";
              }
            }}
          >
            Quay lại
          </a>
          <a
            className={styles.goToHome}
            href={rootPath || "/"}
            title="Về trang chủ"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};
export default Error;
