import { PureComponent, ReactNode } from "react";
import ReactDOM from "react-dom";

/**
 *
 */
interface PortalProps {
  children?: ReactNode;
  /**
   * Element wapper
   * Mặc định không truyền là body
   */
  ToElement?: HTMLElement;
}

class Portal extends PureComponent<
  PortalProps,
  { toEl: HTMLElement | undefined }
> {
  constructor(props: PortalProps) {
    super(props);
    this.state = {
      toEl: this.props.ToElement || document.getElementsByTagName("body")?.[0],
    };
  }
  render() {
    return this.state.toEl ? (
      ReactDOM.createPortal(<>{this.props?.children}</>, this.state.toEl)
    ) : (
      <></>
    );
  }
}
export default Portal;
