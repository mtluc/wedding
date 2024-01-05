import { KeyboardEvent, PureComponent, RefObject, createRef } from "react";
import { Transition } from "react-transition-group";
import { buildClass, handlerDocumentKeyDown } from "../base/common";
interface IModalProps {
  /**
   * Tiêu đề
   */
  title?: string;

  /**
   * Thời gian animation
   */
  duration?: number;

  /**
   * validate trước khi đóng modal
   * @returns true: tiếp tục đóng, false: không đóng
   */
  beforClose?: () => Promise<boolean> | boolean;

  /**
   * Sự kiện đóng modal
   */
  onClose?: () => void;

  children?: any;

  className?: string;

  width?: number;

  onKeyDown?: (e: KeyboardEvent) => void
}

interface IModalState {
  isIn: boolean;
  hidden: boolean;
}

const transitionStyles = {
  entering: { opacity: 0, transform: "scale(0.8)" },
  entered: { opacity: 1, transform: "scale(1)" },
  exiting: { opacity: 1, transform: "scale(1)" },
  exited: { opacity: 0, transform: "scale(0.8)" },
};

class Modal extends PureComponent<IModalProps, IModalState> {
  nodeRef!: RefObject<any>;
  constructor(_props: IModalProps) {
    super(_props);
    this.state = {
      isIn: false,
      hidden: true,
    };
    this.nodeRef = createRef();
  }

  async onClose() {
    try {
      if (!this.props?.beforClose || (await this.props?.beforClose?.())) {
        const onClose = this.props?.onClose;
        this.setState({
          isIn: false,
        });

        this.removeKeydownEvent?.();
        this.removeKeydownEvent = undefined;

        setTimeout(async () => {
          onClose?.();
          this.setState({
            hidden: true,
          });
        }, this.props?.duration || 300);
      }
    } catch (error) {
      console.error(error);
    }
  }

  removeKeydownEvent?: () => void;
  componentDidMount(): void {
    this.setState({ isIn: true, hidden: false });
    this.removeKeydownEvent = handlerDocumentKeyDown((e) => {
      this.onKeyDown(e);
    })
  }

  async onKeyDown(e: KeyboardEvent) {
    try {
      if (e.keyCode == 27) {
        this.onClose();
      } else {
        this.props.onKeyDown?.(e);
      }
    } catch (error) { }
  }

  render() {
    return (
      <Transition
        nodeRef={this.nodeRef}
        in={this.state.isIn}
        timeout={0}
        onExited={() => { }}
      >
        {(state) => (
          <div
            className={buildClass(["modal-wapper", this.props.className])}
            hidden={this.state.hidden}
          // onKeyDown={this.onKeyDown.bind(this)}
          // tabIndex={0}
          >
            <div
              className="modal-main"
              style={{
                ...{
                  transition: `all ${this.props?.duration || 300
                    }ms ease-in-out`,
                  opacity: 0,
                },
                ...(transitionStyles as any)[state],
              }}
            >
              <div className="mtl-modal-header">
                <div className="mtl-modal-title">{this.props?.title}</div>
                <button
                  className="modal-btn-close"
                  type="button"
                  title="Đóng"
                  onClick={this.onClose.bind(this)}
                ></button>
              </div>
              <div
                className="mtl-modal-content custom-scroll"
                style={{
                  width: this.props.width,
                }}
              >
                {this.props?.children}
              </div>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}
export default Modal;
