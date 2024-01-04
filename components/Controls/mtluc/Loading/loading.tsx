import { PureComponent } from "react";
import { buildClass } from "../base/common";

interface ILoadingProps {
  isLoading?: boolean;
  isFix?: boolean;
  subcriberSetApploading?: (event: (isLoading: boolean) => void) => void;
}

interface ILoadingState {
  isLoading: boolean;
}

class Loading extends PureComponent<ILoadingProps, ILoadingState> {
  /**
   *
   */
  constructor(_props: ILoadingProps) {
    super(_props);
    this.state = {
      isLoading: _props.isLoading == undefined ? true : _props.isLoading,
    };
  }

  componentDidMount() {
    if (this.props.subcriberSetApploading) {
      this.props.subcriberSetApploading(this.setLoading.bind(this));
    }
  }

  setLoading(isLoading: boolean) {
    this.setState({
      isLoading: isLoading,
    });
  }

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <div
            className={buildClass([
              "mtl-loading-wapper",
              this.props.isFix ? "mtl-loading-root" : "",
            ])}
          >
            <svg
              className="svg-loading"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <g transform="translate(80,50)">
                <g transform="rotate(0)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.875s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.875s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(71.21320343559643,71.21320343559643)">
                <g transform="rotate(45)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.75s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.75s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(50,80)">
                <g transform="rotate(90)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.625s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.625s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(28.786796564403577,71.21320343559643)">
                <g transform="rotate(135)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.5s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.5s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(20,50.00000000000001)">
                <g transform="rotate(180)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.375s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.375s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(28.78679656440357,28.786796564403577)">
                <g transform="rotate(225)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.25s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.25s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(49.99999999999999,20)">
                <g transform="rotate(270)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.125s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.125s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(71.21320343559643,28.78679656440357)">
                <g transform="rotate(315)">
                  <circle cx="0" cy="0" r="6" fill="#ff7b00">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="0s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="0s"
                    ></animate>
                  </circle>
                </g>
              </g>
            </svg>
          </div>
        ) : null}
      </>
    );
  }
}
export default Loading;
