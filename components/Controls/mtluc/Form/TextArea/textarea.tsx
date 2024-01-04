import { buildClass } from "../../base/common";
import {
  BaseControl,
  IControlProps,
  IControlState,
} from "../../base/controlBase";
import { FormContext } from "../form-context";

export interface ITextAreaProps extends IControlProps {
  rows?: number;
  resize?: "vertical" | "none" | "auto" | "horizontal";
  minLength?: number;
  maxLength?: number;
}

class TextArea extends BaseControl<
  ITextAreaProps,
  IControlState<ITextAreaProps>
> {
  static contextType = FormContext;

  static getDerivedStateFromProps(
    nextProps: ITextAreaProps,
    prevState: IControlState<ITextAreaProps>
  ) {
    const newState: any = {};
    if (nextProps.value && nextProps.value !== prevState._props.value) {
      newState.value = nextProps.value;
    }

    if (prevState._props.disabled !== nextProps.disabled) {
      newState.disabled = nextProps.disabled;
    }

    if (prevState._props.readonly !== nextProps.readonly) {
      newState.readonly = nextProps.readonly;
    }

    if (Object.keys(newState).length) {
      return { ...newState, _props: { ...nextProps } };
    } else {
      return null;
    }
  }

  override validate(v: any): string {
    let error = super.validate(v);
    if (error) {
      return error;
    }

    if (
      v?.toString()?.trim() &&
      this.props.minLength !== undefined &&
      v?.toString()?.trim().length < this.props.minLength
    ) {
      return `Trường này phải nhập trên ${this.props.minLength} ký tự`;
    }

    if (
      v?.toString()?.trim() &&
      this.props.maxLength !== undefined &&
      v?.toString()?.trim().length > this.props.maxLength
    ) {
      return `Trường này phải nhập dưới ${this.props.maxLength} ký tự`;
    }

    return "";
  }

  setElementValue(v:any){
    v = v?.toString?.() || "";
    return super.setElementValue(v);
  }

  render() {
    return (
      <>
        <textarea
          ref={this.ref}
          id={this.id}
          name={this.props.name}
          className={buildClass([
            "mtl-textarea",
            this.props.className,
            this.state.error ? "invalid" : "",
          ])}
          style={{
            ...this.props.style,
            resize: (this.props.resize as any) || "none",
          }}
          rows={this.props.rows || 3}
          placeholder={this.props.placeholder}
          readOnly={this.state.readonly}
          disabled={this.state.disabled}
          //
          onChange={this.onChange.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onClick={this.onClick.bind(this)}
          onCopy={this.onCopy.bind(this)}
          onCut={this.onCut.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onInput={this.onInput.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)}
        />
        {<span className="invalid-msg">{this.state.error}</span>}
      </>
    );
  }
}
export default TextArea;
