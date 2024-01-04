import { PureComponent, ReactNode } from "react";
import DiaLog from "../Dialog/dialog";
import { newGuid } from "../base/common";
import Portal from "../Portal/portal";
interface IDialogManagerProps {
  subcriberPushDialog?: (event: MethodAddDialog) => void;
}

interface IDialogManagerState {
  dialogs: DialogConfig[];
}

interface DialogConfig {
  id: string;
  title?: string;
  content?: any;
  type?: "noti" | "error" | "question";
  preventAction?: (type: "close" | "accept" | "cancel") => Promise<boolean>;
  action?: (type: "close" | "accept" | "cancel") => void;
  width?: number;
}

export type MethodAddDialog = (
  title?: string,
  content?: any,
  type?: "noti" | "error" | "question",
  preventAction?: (type: "close" | "accept" | "cancel") => Promise<boolean>,
  action?: (type: "close" | "accept" | "cancel") => void,
  width?: number
) => void;

class DiaLogManager extends PureComponent<
  IDialogManagerProps,
  IDialogManagerState
> {
  constructor(_props: IDialogManagerProps) {
    super(_props);
    this.state = {
      dialogs: [],
    };
  }

  componentDidMount() {
    if (this.props.subcriberPushDialog) {
      this.props.subcriberPushDialog(this.addDialog.bind(this));
    }
  }

  addDialog(
    title?: string,
    content?: any,
    type?: "noti" | "error" | "question",
    preventAction?: (type: "close" | "accept" | "cancel") => Promise<boolean>,
    action?: (type: "close" | "accept" | "cancel") => void,
    width?: number
  ) {
    const dialog = {
      id: newGuid(),
      title: title,
      content: content,
      type: type,
      preventAction: preventAction,
      action: action,
      width: width,
    } as DialogConfig;

    this.setState({
      dialogs: [dialog, ...this.state.dialogs],
    });
  }

  onClose(noti: DialogConfig) {
    this.setState({
      dialogs: this.state.dialogs.filter((x) => x !== noti),
    });
    return true;
  }

  render(): ReactNode {
    return (
      <>
        {this.state?.dialogs?.map((x) => {
          return (
            <Portal key={x.id}>
              <DiaLog
                title={x.title}
                type={x.type}
                content={x.content}
                width={x.width}
                preventAction={x.preventAction}
                action={(type: "accept" | "close" | "cancel") => {
                  x.action?.(type);
                  setTimeout(() => {
                    this.onClose(x);
                  }, 300);
                }}
              />
            </Portal>
          );
        })}
      </>
    );
  }
}
export default DiaLogManager;
