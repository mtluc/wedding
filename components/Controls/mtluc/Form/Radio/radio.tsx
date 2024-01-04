import { ChangeEvent } from "react";
import { buildClass } from "../../base/common";
import {
  BaseControl,
  ControlType,
  IControlProps,
  IControlState,
} from "../../base/controlBase";
import { FormContext } from "../form-context";

export interface IRadioProps extends IControlProps {
  optionValue?: any;
}

class Radio extends BaseControl<IRadioProps, IControlState<IRadioProps>> {
  static contextType = FormContext;

  public override type: ControlType = "radio";

  override initState(props: IRadioProps) {
    const _value = super.initState(props);
    return {
      ..._value,
      // eslint-disable-next-line eqeqeq
      value: _value.value == props.optionValue ? true : false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: IRadioProps,
    prevState: IControlState<IRadioProps>
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
    // if (this.ref.current) {
    //   this.ref.current.checked = v;
    // }
    return v ? true : false;
  }

  /**
   * Khi thay đổi giá trị
   * @param e
   */
  override async onChange(e: ChangeEvent) {
    const _value = (e.target as any).checked;
    this.props.onChange?.(e, this, _value);
  }

  override get value() {
    return this.ref?.current?.checked;
  }

  override set value(v: any) {
    this.setState({ value: this.setElementValue(v) });
    this.error = this.validate(v);
  }

  override componentDidMount(): void {
    super.componentDidMount();
    setTimeout(() => {
      if (this.ref.current) {
        this.ref.current.checked = this.state.value;
      }
    }, 1);
  }

  render() {
    return (
      <input
        ref={this.ref}
        type="radio"
        id={this.id}
        name={this.props.name}
        className={buildClass(["mtl-radio", this.props.className])}
        style={this.props.style}
        disabled={this.state.disabled || this.state.readonly}
        value={this.props.optionValue}
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
export default Radio;
