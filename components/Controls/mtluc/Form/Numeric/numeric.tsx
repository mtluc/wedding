import { buildClass } from "../../base/common";
import {
  BaseControl,
  IControlProps,
  IControlState,
} from "../../base/controlBase";
import MyFormContext, { FormContext } from "../form-context";
import {
  KeyboardEvent,
  FormEvent,
  ChangeEvent,
  MouseEvent,
  FocusEvent,
} from "react";

export interface INumericProps extends IControlProps {
  min?: number;
  max?: number;
  separatorGroup?: string;
  separator?: string;
  format?: string;
  creaseButton?: "none" | "horizontal" | "vertical";
  step?: number;
}

class Numeric extends BaseControl<INumericProps, IControlState<INumericProps>> {
  static contextType = FormContext;
  get separatorGroup() {
    return this.props.separatorGroup || ".";
  }
  get separator() {
    return this.props.separator || ",";
  }

  get format() {
    return this.props.format || "n2";
  }

  get creaseButton() {
    return this.props.creaseButton || "horizontal";
  }

  get step() {
    return this.props.step || 1;
  }

  get max() {
    return this.props.max !== undefined ? this.props.max : 1000000000000000.0;
  }

  get min() {
    return this.props.min !== undefined ? this.props.min : -1000000000000000.0;
  }

  getSelection(inputEl: HTMLInputElement) {
    return {
      start: inputEl.selectionStart || 0,
      end: inputEl.selectionEnd || 0,
    };
  }

  private get fix(): number {
    const s = this.format?.toLocaleLowerCase().replace(/[a-zA-Z]/gi, "");
    return parseInt(s);
  }

  convertToValue(str: string) {
    let value: number = 0;
    if (this.separatorGroup) {
      const reg = new RegExp(`\\${this.separatorGroup}`, "gi");
      value = parseFloat(str.replace(reg, "").replace(this.separator, "."));
    } else {
      value = parseFloat(str.replace(this.separator, "."));
    }
    return value;
  }

  private calc(value: any) {
    // eslint-disable-next-line no-useless-escape
    const reg = new RegExp(`^-?\\\d{0,}(?:\\\.\\\d{0,${this.fix}})?`);
    const strValue = value.toString().match(reg)[0];
    return parseFloat(strValue) || 0;
  }

  private get rgxFormatValue(): RegExp {
    let rgx: string = `\\d(?=(\\d{3})+$)`;
    if (this.fix > 0) {
      rgx = `\\d(?=(\\d{3})+\\${this.separator})`;
    }
    return new RegExp(rgx, "g");
  }

  private formatValue(value: number, isAbs: boolean) {
    var result = "";
    if (value === undefined || isNaN(value)) {
      return "";
    }
    if (!isAbs) {
      result = "-";
    }
    return (
      result +
      this.calc(Math.abs(value))
        .toFixed(this.fix)
        .replace(".", this.separator)
        .replace(this.rgxFormatValue, "$&" + this.separatorGroup)
    );
  }

  static getDerivedStateFromProps(
    nextProps: INumericProps,
    prevState: IControlState<INumericProps>
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

  override shouldComponentUpdate(
    nextProps: IControlProps,
    nextState: IControlState<IControlProps>
  ) {
    return super.shouldComponentUpdate(nextProps, nextState);
  }

  override get value() {
    return this.state.value;
  }

  /**
   * Xử lý init state dựa trên props
   * @param props
   * @returns
   */
  override initState(props: INumericProps) {
    let value = props.value;
    if (!value) {
      if (props.defaultValue === 0 || props.defaultValue) {
        value = props.defaultValue;
      }
    }

    if (value !== 0 && !value) {
      value = "";
    }

    return {
      _props: { ...props },
      value: value,
      readonly: props.readonly || false,
      disabled: props.disabled || false,
      error: "",
    } as IControlState<INumericProps>;
  }

  override set value(v: any) {
    this.setState({ value: this.setElementValue(v) });
    this.error = this.validate(v);
  }

  override async onBlur(e: FocusEvent) {
    const error = this.onValidate(this.value);
    if (error !== this.error) {
      this.error = error;
    }
    this.props?.onBlur?.(e);
  }

  override validate(v: any): string {
    let error = super.validate(v);
    if (error) {
      return error;
    }

    if (v !== undefined && this.props.min !== undefined && v < this.props.min) {
      return `Trường này phải lớn hơn hoặc bằng ${this.props.min}`;
    }

    if (v !== undefined && this.props.max !== undefined && v > this.props.max) {
      return `Trường này phải nhỏ hơn hoặc bằng ${this.props.max}`;
    }
    return "";
  }

  override async onKeyPress(e: KeyboardEvent) {
    if (this.readonly || this.disabled) {
      e.preventDefault();
      return;
    }

    //Xử lý chặn các ký tự không được phép nhập
    if (e?.key && !e?.ctrlKey) {
      if (e.key !== this.separatorGroup) {
        const oldValue = this.ref.current.value;
        let value = "";
        const cursor = this.getSelection(e.target as HTMLInputElement);

        if (cursor.start === 0 && cursor.end === oldValue.length) {
          cursor.end = 0;
          value += e.key;
        } else {
          value = [
            oldValue.slice(0, cursor.start),
            e.key,
            oldValue.slice(
              cursor.start === cursor.end ? cursor.start : cursor.start + 1
            ),
          ].join("");
        }
        if (this.separatorGroup) {
          value = value.replace(
            new RegExp(`\\${this.separatorGroup}`, "gi"),
            ""
          );
        }
        if (value === "-") {
          value = "-0";
        }
        let reg = new RegExp(
          `^-{0,1}[0-9]{0,}\\${this.separator}{0,1}[0-9]{0,}$`
        );
        if (reg.test(value)) {
          return;
        }
      }
      e.preventDefault();
    }
  }

  override async onInput(e: FormEvent) {
    const inputEl = e.target as HTMLInputElement;
    if (inputEl.value === "-") {
      return;
    }
    const cursor = this.getSelection(inputEl);
    //tính cursor, format & giá trị
    const oldValue = inputEl.value + "";
    let newValue = "";
    if (oldValue !== "") {
      let idxSeparator = oldValue.indexOf(this.separator);
      if (idxSeparator < 0) {
        idxSeparator = oldValue.length;
      }

      let curS = 0;
      let curE = 0;
      //phần nguyên
      for (let i = idxSeparator - 1; i >= 0; i--) {
        let char = oldValue[i];
        if (char === this.separatorGroup) {
          if (cursor.start >= i) curS -= 1;
          if (cursor.end >= i) curE -= 1;
        } else if (char === "-") {
          newValue = char + newValue;
        } else {
          if (
            newValue.length > 2 &&
            this.separatorGroup &&
            (newValue.indexOf(this.separatorGroup) < 0 ||
              newValue.indexOf(this.separatorGroup) > 2)
          ) {
            if (cursor.start >= i) curS += 1;
            if (cursor.end >= i) curE += 1;
            newValue = this.separatorGroup + newValue;
          }
          newValue = char + newValue;
        }
      }

      //phần thập phân
      if (this.fix > 0) {
        newValue += this.separator;
        for (let i = 1; i <= this.fix; i++) {
          newValue += oldValue[idxSeparator + i] || "0";
        }
      }

      let _value = 0;

      if (this.separatorGroup) {
        _value = this.convertToValue(
          newValue.replace(new RegExp(`\\${this.separatorGroup}`, "gi"), "")
        );
      } else {
        _value = this.convertToValue(newValue);
      }

      // eslint-disable-next-line no-useless-escape
      newValue = this.formatValue(_value, !/^\-/.test(newValue));

      cursor.start += curS;
      cursor.end += curE;

      if (cursor.start > newValue.length) {
        cursor.start = newValue.length;
      }

      if (cursor.end > newValue.length) {
        cursor.end = newValue.length;
      }

      this.value = _value;
      inputEl.setSelectionRange(cursor.start, cursor.end);
      this.props.onChange?.(
        {
          target: this.ref?.current,
        } as any,
        this,
        _value
      );
      (this.context as MyFormContext)?.valueChange?.(
        {
          target: this.ref?.current,
        } as any,
        this.value,
        _value,
        this
      );
    } else {
      this.value = undefined;
      this.props.onChange?.(
        {
          target: this.ref?.current,
        } as any,
        this,
        undefined
      );
      (this.context as MyFormContext)?.valueChange?.(
        {
          target: this.ref?.current,
        } as any,
        this.value,
        undefined,
        this
      );
    }
  }

  override async onChange(e: ChangeEvent) {
    // this.props.onChange?.(e, this, undefined);
  }

  increase(e?: MouseEvent) {
    if (this.readonly || this.disabled || !this.creaseButton) {
      return;
    }
    e?.stopPropagation();
    e?.preventDefault();
    if (!this.disabled) {
      const oldValue = this.ref.current?.value || "";
      let value = this.convertToValue(oldValue);
      if (!value) {
        value = 0;
      }
      if (value <= this.max - this.step) {
        this.value = value + this.step;
        this.props.onChange?.(
          { target: this.ref.current } as any,
          this,
          value + this.step
        );
        (this.context as MyFormContext)?.valueChange?.(
          {
            target: this.ref?.current,
          } as any,
          oldValue,
          value + this.step,
          this
        );
      }
    }
    this.focus();
  }

  decrease(e?: MouseEvent) {
    if (this.readonly || this.disabled || !this.creaseButton) {
      return;
    }
    if (!this.disabled) {
      const oldValue = this.ref.current?.value || "";
      let value = this.convertToValue(oldValue);
      if (!value) {
        value = 0;
      }
      if (value >= this.min + this.step) {
        this.value = value - this.step;
        this.props.onChange?.(
          { target: this.ref.current } as any,
          this,
          value - this.step
        );
        (this.context as MyFormContext)?.valueChange?.(
          {
            target: this.ref?.current,
          } as any,
          oldValue,
          value - this.step,
          this
        );
      }
    }
    this.focus();
  }

  override async onKeyDown(e: KeyboardEvent) {
    if (this.readonly || this.disabled) {
      return;
    }
    const el = e.target as HTMLInputElement;
    if (e.keyCode === 38) {
      this.increase();
      e.preventDefault();
    } else if (e.keyCode === 40) {
      this.decrease();
      e.preventDefault();
    } else if (e.keyCode === 8) {
      const cursor = this.getSelection(el);
      if (
        el.value.indexOf(this.separator) >= 0 &&
        el.value.indexOf(this.separator) === cursor.start - 1
      ) {
        el.setSelectionRange(cursor.start - 1, cursor.end - 1);
        e.preventDefault();
      }
    } else if (e.keyCode === 46) {
      const cursor = this.getSelection(el);
      if (
        el.value.indexOf(this.separator) >= 0 &&
        el.value.indexOf(this.separator) === cursor.start
      ) {
        el.setSelectionRange(cursor.start + 1, cursor.end + 1);
        e.preventDefault();
      }
    } else if (e.key === this.separator) {
      let idx = el.value.indexOf(",");
      if (idx < 0) {
        idx = el.value.length - 1;
      }
      (e.target as HTMLInputElement)?.setSelectionRange(idx + 1, idx + 1);
      e.preventDefault();
    }
  }

  override setElementValue(v: any) {
    if (v === "" || v == undefined) {
      if (this.ref.current) {
        this.ref.current.value = "";
      }
      return v;
    } else {
      v = Number.isFinite(Number.parseFloat(v)) ? v : 0;
      if (this.ref.current) {
        const isAbs =
          v === 0
            ? // eslint-disable-next-line no-useless-escape
            !/^\-/.test(this.ref.current.value)
            : // eslint-disable-next-line no-useless-escape
            !/^\-/.test(v?.toString());
        this.ref.current.value = this.formatValue(v, isAbs);
      }
      return v;
    }
  }

  render() {
    return (
      <>
        <div
          className={buildClass([
            "mtl-numeric-wap",
            this.creaseButton,
            this.props.className,
            this.state.error ? "invalid" : "",
            this.state.disabled ? "disabled" : "",
            this.state.readonly ? "readonly" : "",
          ])}
          style={this.props.style}
        >
          {this.creaseButton === "horizontal" ? (
            <button
              type="button"
              className="btn-h-decrease"
              disabled={this.state.disabled || this.state.readonly}
              onClick={this.decrease.bind(this)}
            >
              <svg className="btn-h-icon" viewBox="0 0 32 32">
                <line x1="7" x2="25" y1="16" y2="16" />
              </svg>
            </button>
          ) : null}
          <input
            ref={this.ref}
            type="text"
            id={this.id}
            name={this.props.name}
            className={buildClass(["mtl-numeric"])}
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
          {this.creaseButton === "horizontal" ? (
            <button
              type="button"
              className="btn-h-increase"
              disabled={this.state.disabled || this.state.readonly}
              onClick={this.increase.bind(this)}
            >
              <svg className="btn-h-icon" viewBox="0 0 32 32">
                <line x1="16" x2="16" y1="7" y2="25" />
                <line x1="7" x2="25" y1="16" y2="16" />
              </svg>
            </button>
          ) : this.creaseButton === "vertical" ? (
            <div className="btn-v-group">
              <button
                type="button"
                className="btn-v-increase"
                disabled={this.state.disabled || this.state.readonly}
                onClick={this.increase.bind(this)}
              >
                <svg className="btn-h-icon" viewBox="0 0 32 32">
                  <line x1="15" x2="24" y1="11" y2="20" />

                  <line x1="15" x2="6" y1="11" y2="20" />
                </svg>
              </button>
              <button
                type="button"
                className="btn-v-decrease"
                disabled={this.state.disabled || this.state.readonly}
                onClick={this.decrease.bind(this)}
              >
                <svg className="btn-h-icon" viewBox="0 0 32 32">
                  <line x1="15" x2="24" y1="20" y2="11" />

                  <line x1="15" x2="6" y1="20" y2="11" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
        {<span className="invalid-msg">{this.state.error}</span>}
      </>
    );
  }
}
export default Numeric;
