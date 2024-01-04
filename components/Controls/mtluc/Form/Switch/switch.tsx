import { ChangeEvent } from "react";
import { buildClass } from "../../base/common";
import {
  BaseControl,
  ControlType,
  IControlProps,
  IControlState,
} from "../../base/controlBase";
import { FormContext } from "../form-context";

export interface ISwitchProps extends IControlProps {}

class Switch extends BaseControl<ISwitchProps, IControlState<ISwitchProps>> {
  static contextType = FormContext;

  public override type: ControlType = "check";

  override initState(props: ISwitchProps) {
    const _value = super.initState(props);
    return {
      ..._value,
      value: _value.value ? true : false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: ISwitchProps,
    prevState: IControlState<ISwitchProps>
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

  override setElementValue(v: any) {
    if (this.ref.current) {
      this.ref.current.checked = v ? true : false;
    }
    return v ? true : false;
  }

  /**
   * Khi thay đổi giá trị
   * @param e
   */
  override async onChange(e: ChangeEvent) {
    const _value = (e.target as any).checked;

    if (_value !== this.value) {
      this.value = _value;
    }
    this.props.onChange?.(e,this,_value);
  }

  render() {
    return (
      <input
        ref={this.ref}
        type="checkbox"
        id={this.id}
        name={this.props.name}
        className={buildClass(["mtl-switch", this.props.className])}
        style={this.props.style}
        disabled={this.state.disabled || this.state.readonly}
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
    );
  }
}
export default Switch;
