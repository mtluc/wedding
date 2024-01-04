import { createRef, useCallback, useEffect } from "react";
import Modal from "../Modal/modal";
import IconSvg from "../icon/icon-svg";
export interface IDiaLogProps {
  title?: string;
  type: "noti" | "error" | "question";
  content: any;
  preventAction?: (type: "close" | "accept" | "cancel") => Promise<boolean>;
  action?: (type: "close" | "accept" | "cancel") => void;
  width?: number;
}
const DiaLog = (props: IDiaLogProps) => {
  const ref = createRef<Modal>();
  const btnAcceptRef = createRef<HTMLButtonElement>();
  const btnCancleRef = createRef<HTMLButtonElement>();
  const handlerAction = useCallback(
    async (type: "close" | "accept" | "cancel") => {
      if (props.preventAction) {
        if (!(await props.preventAction(type))) {
          return;
        }
      }
      props.action?.(type);
      ref.current?.onClose();
    },
    [props, ref]
  );

  useEffect(() => {
    setTimeout(() => {
      if (btnAcceptRef?.current) {
        btnAcceptRef.current.focus();
      } else {
        btnCancleRef?.current?.focus();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      ref={ref}
      title={props.title || "Thông báo"}
      width={props.width}
      beforClose={async () => {
        let result = true;
        if (props?.preventAction) {
          result = await props.preventAction("close");
        }

        if (result) {
          if (props.action) {
            props.action("close");
          }
        }
        return result;
      }}
    >
      <div className="mtl-dialog-content">
        <div className="icons">
          {props.type == "question" ? (
            <IconSvg iconKeys="question" className={`icon-${props.type}`} />
          ) : props.type == "error" ? (
            <IconSvg iconKeys="warning" className={`icon-${props.type}`} />
          ) : (
            <IconSvg iconKeys="bell" className={`icon-${props.type}`} />
          )}
        </div>
        {typeof props.content === "string" ? (
          <div
            className="content-info"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        ) : props.content ? (
          props.content
        ) : (
          ""
        )}
      </div>
      <div className="mtl-dialog-toolbar">
        {props.type == "question" ? (
          <button
            ref={btnAcceptRef}
            type="button"
            className="btn-primary-ltr"
            onClick={() => {
              handlerAction("accept");
            }}
          >
            <IconSvg iconKeys="check" />
            <span>Đồng ý</span>
          </button>
        ) : null}
        <button
          ref={btnCancleRef}
          type="button"
          className="btn btn-close"
          onClick={() => {
            handlerAction("cancel");
          }}
        >
          <IconSvg iconKeys="close" />
          <span>{props.type == "question" ? "Không" : "Đóng"}</span>
        </button>
      </div>
    </Modal>
  );
};
DiaLog.defaultProps = {
  type: "question",
  content: "",
  width: 300,
};
export default DiaLog;
