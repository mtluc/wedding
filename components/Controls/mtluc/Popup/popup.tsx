import { PureComponent, ReactNode, RefObject, createRef } from "react";
import Portal from "../Portal/portal";
import {
  createMethodClickOutSide,
  getPositionElementInWindow,
} from "../base/common";

interface IPopupProp {
  parentRef?: RefObject<HTMLElement>;
  children?: ReactNode;
  showChange?: (isShow: boolean, e?: MouseEvent) => void;
  closeOutSide?: boolean;
}

interface IPopupState {}

class Popup extends PureComponent<IPopupProp, IPopupState> {
  ref!: RefObject<HTMLDivElement>;

  methodClickOutSide?: ((e: MouseEvent) => void) | null;

  timeOutChangeCss?: any;
  methodChangeCss?: () => void;

  constructor(props: IPopupProp) {
    super(props);
    this.ref = createRef<HTMLDivElement>();
  }

  changeCss() {
    if (this.props.parentRef) {
      const position = {
        top: 0,
        left: 0,
        right: -1,
        bottom: -1,
      };

      if (this.props.parentRef.current?.ELEMENT_NODE && this.ref.current) {
        const bonParent = getPositionElementInWindow(
          this.props.parentRef.current
        );
        const bonPopup = getPositionElementInWindow(this.ref.current);
        let top = bonParent.y + bonParent.height;
        let left = bonParent.x;

        if (left + bonPopup.width > window.innerWidth) {
          left = left - +bonPopup.width + bonParent.width;
        }
        position.left = left;

        if (top + bonPopup.height > window.innerHeight) {
          position.bottom = window.innerHeight - bonParent.y;
          position.top = -1;
        } else {
          position.top = top;
        }

        for (const key in position) {
          if (Object.prototype.hasOwnProperty.call(position, key)) {
            (this.ref.current.style as any)[key] =
              (position as any)[key] >= 0
                ? (position as any)[key] + "px"
                : undefined;
          }
        }
        this.ref.current.style.visibility = "visible";
      }
    }
  }
  
  componentDidMount() {
    if (this.props.closeOutSide !== false) {
      this.methodClickOutSide = createMethodClickOutSide(this.ref, (e: any) => {
        this.setState({
          isShow: false,
        });
        this.props.showChange?.(false, e);
      });
      document.addEventListener("mousedown", this.methodClickOutSide);
    }
    this.changeCss();

    if (this.props.parentRef) {
      this.methodChangeCss = () => {
        if (this.props.parentRef && this.ref.current) {
          if (this.timeOutChangeCss) {
            clearTimeout(this.timeOutChangeCss);
          }
          this.timeOutChangeCss = setTimeout(() => {
            this.changeCss();
          }, 200);
        }
      };
      document.addEventListener("scroll", this.methodChangeCss);
      window.addEventListener("resize", this.methodChangeCss);
    }
  }

  componentWillUnmount() {
    if (this.methodClickOutSide) {
      document.removeEventListener("mousedown", this.methodClickOutSide);
      this.methodClickOutSide = null;
    }

    if (this.timeOutChangeCss) {
      clearTimeout(this.timeOutChangeCss);
      this.timeOutChangeCss = null;
    }

    if (this.props.parentRef && this.methodChangeCss) {
      document.removeEventListener("scroll", this.methodChangeCss);
      window.removeEventListener("resize", this.methodChangeCss);
    }
  }

  render() {
    return (
      <Portal>
        <div ref={this.ref} className="mtl-popup">
          {this.props.children}
        </div>
      </Portal>
    );
  }
}

export default Popup;
