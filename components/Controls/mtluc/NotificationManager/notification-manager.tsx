import { PureComponent, RefObject, createRef } from "react";
import Notification from "../Notification/notification";
import { newGuid } from "../base/common";

interface NotificationManagerProps {
  subcriberPushNotification?: (event: MethodAddNotification) => void;
}

interface NotificationManagerState {
  notifications: NotificationConfig[];
}

interface NotificationConfig {
  id: string;
  ref: RefObject<HTMLLIElement>;
  message?: string;
  onClose: () => void;
  closeTimeOut: any;
  type?: "primary" | "secondary" | "success" | "danger" | "warning";
}

export type MethodAddNotification = (
  message?: string,
  type?: "primary" | "secondary" | "success" | "danger" | "warning",
  intervalClose?: number,
  onClose?: () => void
) => void

class NotificationManager extends PureComponent<
  NotificationManagerProps,
  NotificationManagerState
> {
  constructor(_props: NotificationManagerProps) {
    super(_props);
    this.state = {
      notifications: [],
    };
  }

  componentDidMount() {
    if (this.props.subcriberPushNotification) {
      this.props.subcriberPushNotification(this.addNotification.bind(this));
    }
  }

  onClose(noti: NotificationConfig) {
    const container = noti.ref.current;
    container?.classList.add("hide");

    if (noti.closeTimeOut) {
      clearTimeout(noti.closeTimeOut);
    }

    setTimeout(() => {
      this.setState({
        notifications: this.state.notifications.filter((x) => x !== noti),
      });
    }, 600);
  }

  addNotification(
    message?: string,
    type?: "primary" | "secondary" | "success" | "danger" | "warning",
    intervalClose: number = 2000,
    onClose?: () => void
  ) {
    const noti = {
      id: newGuid(),
      ref: createRef(),
      message: message,
      type: type,
    } as NotificationConfig;

    noti.onClose = () => {
      onClose?.();
      this.onClose(noti);
    };

    if (intervalClose > 0) {
      noti.closeTimeOut = setTimeout(() => {
        noti.onClose();
      }, intervalClose);
    }

    this.setState({
      notifications: [noti, ...this.state.notifications],
    });

    setTimeout(function () {
      noti.ref.current?.classList.add("show");
      const listItem = noti.ref.current?.querySelector(
        ".noti-item"
      ) as HTMLDivElement;
      if (noti.ref.current && listItem) {
        noti.ref.current.style.height = listItem.offsetHeight + "px";
      }
    }, 10);
  }

  render() {
    return this.state?.notifications?.length ? (
      <ul className="mtl-noti-list">
        {this.state?.notifications?.map((x) => {
          return (
            <li key={x.id} ref={x.ref} className="mtl-noti-item">
              <div className="noti-item">
                <Notification
                  type={x.type}
                  message={x.message}
                  onClose={x.onClose}
                />
              </div>
            </li>
          );
        })}
      </ul>
    ) : null;
  }
}

export default NotificationManager;
