import { Component } from "react";
import { buildClass } from "../base/common";
interface INotificationProps {
  className?: string;
  type?: "primary" | "secondary" | "success" | "danger" | "warning";
  message?: string;
  children?: any;
  onClose?: () => void;
}

interface INotificationState {}

class Notification extends Component<INotificationProps, INotificationState> {
  shouldComponentUpdate(
    nextProps: INotificationProps,
    nextState: INotificationState
  ) {
    if (nextProps.children !== this.props.children) {
      return true;
    }

    if (nextProps.className !== this.props.className) {
      return true;
    }

    if (nextProps.type !== this.props.type) {
      return true;
    }

    if (nextProps.message !== this.props.message) {
      return true;
    }

    if (nextProps.onClose !== this.props.onClose) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <>
        <div
          className={buildClass([
            "mtl-noti-wap",
            this.props.className,
            this.props.type || "primary",
          ])}
        >
          <div className="mtl-noti-main">
            <svg
              className="mtl-noti-icon"
              fill="#000000"
              height="1rem"
              width="1rem"
              viewBox="0 0 611.999 611.999"
            >
              <g>
                <g>
                  <g>
                    <path
                      d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
				C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
				c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
				h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
				c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
				C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
				c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
				c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
				 M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
				c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
				c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"
                    />
                  </g>
                </g>
              </g>
            </svg>
            <div className="mtl-noti-message">
              {this.props.message || this.props.children}
            </div>
            <button
              className="mtl-noti-btn-close"
              type="button"
              title="Đóng"
              onClick={() => this.props.onClose?.()}
            ></button>
          </div>
        </div>
      </>
    );
  }
}
export default Notification;
