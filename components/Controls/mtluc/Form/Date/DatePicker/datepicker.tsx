import {
  ChangeEvent,
  RefObject,
  createRef,
  FocusEvent,
  KeyboardEvent,
} from "react";
import Popup from "../../../Popup/popup";
import { buildClass, formatDate, getSelection } from "../../../base/common";
import {
  BaseControl,
  IControlProps,
  IControlState,
} from "../../../base/controlBase";
import { FormContext, IFormContext } from "../../form-context";
import Calendar from "../Calendar/calendar";

interface IDatePickerProps extends IControlProps {
  format?: string;
}

interface IDatePickerState extends IControlState<IDatePickerProps> {
  showCalendar: boolean;
}

class DatePicker extends BaseControl<IDatePickerProps, IDatePickerState> {
  static contextType = FormContext;

  waperRef!: RefObject<HTMLDivElement>;

  get format() {
    return this.props.format || "dd/mm/yyyy";
  }

  constructor(props: IDatePickerProps, ctx: any) {
    super(props, ctx);
    this.waperRef = createRef<HTMLDivElement>();
  }

  static getDerivedStateFromProps(
    nextProps: IDatePickerProps,
    prevState: IControlState<IDatePickerProps>
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

  override initState(props: IDatePickerProps) {
    return {
      ...super.initState(props),
      showCalendar: false,
      value: this.props.value || this.props.defaultValue || null,
    };
  }

  get previewValue() {
    return this.ref.current?.value;
  }

  override validate(v: any): string {
    if (
      (!this.ref.current?.value || this.previewValue === this.format) &&
      this.props.required
    ) {
      return "Trường này không được để trống";
    }

    if (!v && this.previewValue != this.format) {
      return "Ngày không đúng định dạng";
    }
    return this.props.onValidate?.(v) || "";
  }

  override setElementValue(v: Date): any {
    if (v) {
      v = new Date(Date.parse(v as any));
    }
    if (this.ref.current) {
      this.ref.current.value = formatDate(v, this.format);
    }
    return v;
  }

  checkValue(str: string, max: number) {
    if (
      str !== "" &&
      (str[0] !== "0" || str.length > max.toString().length || str === "00")
    ) {
      var num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str =
        num > parseInt(max.toString().charAt(0)) && num.toString().length === 1
          ? "0" + num
          : num.toString();
    }
    return str;
  }

  checkLeapYear = (year: number) => {
    if ((year % 100 !== 0 && year % 4 === 0) || year % 400 === 0) {
      return true;
    } else {
      return false;
    }
  };

  checkDayInMonth(
    dayStr: string,
    monthStr: string,
    yearStr: string,
    input: "d" | "m" | "y"
  ) {
    const month30Day = [4, 6, 9, 11];

    const result = {
      day: dayStr,
      month: monthStr,
      year: yearStr,
    };

    let day: number = NaN;
    let month: number = NaN;
    let year: number = NaN;

    if (dayStr) {
      day = Number.parseInt(dayStr);
    }

    if (monthStr) {
      month = Number.parseInt(monthStr);
    }

    if (yearStr) {
      year = Number.parseInt(yearStr);
    }

    if (input === "d") {
      if (month) {
        if (month30Day.includes(month) && day > 30) {
          result.month = "01";
        } else if (month === 2 && day > 28) {
          if (!year || !this.checkLeapYear(year)) {
            result.month = "01";
          }
        }
      }
    } else if (input === "m") {
      if (day) {
        if (month30Day.includes(month) && day > 30) {
          result.day = "30";
        } else if (month === 2 && day > 28) {
          if (year && !this.checkLeapYear(year)) {
            result.day = "28";
          }
        }
      }
    } else {
      if (day && month) {
        if (month === 2 && day > 28 && !this.checkLeapYear(year)) {
          result.day = "28";
        } else if (month30Day.includes(month) && day > 30) {
          result.day = "30";
        }
      }
    }

    return result;
  }

  override async onChange(e: ChangeEvent) {
    if (this.ref?.current) {
      let _value = this.ref?.current.value;
      if (/\D\/$/.test(_value)) {
        _value = _value.substring(0, _value.length - 3);
      }
      let values = _value.split("/").map((v: any) => {
        return v.replace(/\D/g, "");
      });

      let idxDay = 0,
        idxMonth = 0,
        idxYear = 0;

      const dayFormat = this.format.substring(
        this.format.indexOf("d"),
        this.format.lastIndexOf("d") + 1
      );

      const monthFormat = this.format.substring(
        this.format.indexOf("m"),
        this.format.lastIndexOf("m") + 1
      );

      const yearFormat = this.format.substring(
        this.format.indexOf("y"),
        this.format.lastIndexOf("y") + 1
      );

      // eslint-disable-next-line array-callback-return
      this.format?.split("/").map((v, i) => {
        if (/d/.test(v)) {
          idxDay = i;
        } else if (/m/.test(v)) {
          idxMonth = i;
        } else {
          idxYear = i;
        }
      });

      let posCurrent = getSelection(this.ref.current);
      let fristPath = _value.indexOf("/") || 0;
      let lastPath = _value.lastIndexOf("/") || 0;
      let step = 0;

      //nhập ô đầu tiên
      if (posCurrent.start <= fristPath || fristPath < 0) {
        step = 0;
      }
      //nhập ô thứ 2
      else if (posCurrent.start <= lastPath) {
        step = 1;
      }
      //nhập ô thứ 3
      else {
        step = 2;
      }

      if (values[idxDay]) values[idxDay] = this.checkValue(values[idxDay], 31);
      if (values[idxMonth])
        values[idxMonth] = this.checkValue(values[idxMonth], 12);

      const objDate = this.checkDayInMonth(
        values[idxDay],
        values[idxMonth],
        values[idxYear],
        step === 0 ? "d" : step === 1 ? "m" : "y"
      );

      if (values[idxDay]) {
        values[idxDay] = objDate.day;
      }

      if (values[idxMonth]) {
        values[idxMonth] = objDate.month;
      }

      let newValue = this.format || "";
      if (values[idxDay]) {
        newValue = newValue.replace(dayFormat, values[idxDay]);
      }

      if (values[idxMonth]) {
        newValue = newValue.replace(monthFormat, values[idxMonth]);
      }

      if (values[idxYear]) {
        newValue = newValue.replace(
          yearFormat,
          values[idxYear].substring(0, yearFormat.length)
        );
      }

      let fristPathNewValue = newValue.indexOf("/") || 0;
      let lastPathNewValue = newValue.lastIndexOf("/") || 0;

      const fnGetMaxlenght = (idx: number) => {
        let value = {
          path: "",
          maxLeght: 0,
        };
        if (idx === idxDay) {
          value.path = "d";
          value.maxLeght = dayFormat.length;
        } else if (idx === idxMonth) {
          value.path = "m";
          value.maxLeght = monthFormat.length;
        } else if (idx === idxYear) {
          value.path = "y";
          value.maxLeght = yearFormat.length;
        }

        return value;
      };

      let selecttionStart = 0;
      let selecttionEnd = 0;

      //nhập ô đầu tiên
      if (step === 0) {
        let maxlenght = fnGetMaxlenght(0);
        if (values[0].length === 0) {
          selecttionStart = 0;
          selecttionEnd = fristPathNewValue;
        } else if (values[0]?.length >= maxlenght.maxLeght) {
          selecttionStart = fristPathNewValue + 1;
          selecttionEnd = lastPathNewValue;
        } else {
          selecttionStart = fristPathNewValue;
          selecttionEnd = fristPathNewValue;
        }
      }
      //nhập ô thứ 2
      else if (step === 1) {
        let maxlenght = fnGetMaxlenght(1);
        if (!values[1]?.length) {
          selecttionStart = fristPathNewValue + 1;
          selecttionEnd = lastPathNewValue;
        } else if (values[1]?.length >= maxlenght.maxLeght) {
          maxlenght = fnGetMaxlenght(2);
          selecttionStart = lastPathNewValue + 1;
          selecttionEnd = lastPathNewValue + 1 + maxlenght.maxLeght;
        } else {
          selecttionStart = lastPathNewValue;
          selecttionEnd = lastPathNewValue;
        }
      }
      //nhập ô thứ 3
      else {
        let maxlenght = fnGetMaxlenght(2);
        if (!values[2]?.length) {
          selecttionStart = lastPathNewValue + 1;
          selecttionEnd = lastPathNewValue + 1 + maxlenght.maxLeght;
        }
      }

      let _newValue = null;
      let oldValue = this.value;
      if (
        values[idxDay] > 0 &&
        values[idxMonth] > 0 &&
        values[idxYear].toString().length >= yearFormat.length
      ) {
        _newValue = new Date(
          values[idxYear].substring(0, yearFormat.length),
          values[idxMonth] - 1,
          values[idxDay]
        );
        this.setState({
          value: _newValue,
        });
      } else {
        this.setState({
          value: null,
        });
      }

      this.ref.current.value = newValue;

      if (selecttionStart || selecttionEnd) {
        this.ref.current.setSelectionRange?.(selecttionStart, selecttionEnd);
      }

      this.error = this.onValidate(_newValue as any);
      if ((_newValue || newValue === this.format) && oldValue !== _newValue) {
        this.props.onChange?.(e, this, _newValue);

        (this.context as IFormContext)?.valueChange?.(
          e,
          oldValue,
          _value,
          this as any
        );
      }
    }
  }

  /**
   * Sự kiện blur khỏi control
   * @param e
   * @returns
   */
  override async onBlur(e: FocusEvent) {
    const value = this.value;
    const error = this.onValidate(value);
    if (error !== this.error) {
      this.error = error;
    }
    this.props?.onBlur?.(e);
  }

  onSelectionChange(v: Date) {
    const oldValue = this.value;

    if (this.value !== v) {
      this.props.onChange?.({ target: this.ref?.current } as any, this, v);
      this.setState({
        showCalendar: false,
      });

      this.value = v;

      (this.context as IFormContext)?.valueChange?.(
        { target: this.ref?.current } as any,
        oldValue,
        v,
        this as any
      );
    }
  }

  onShowChange(isShow: boolean, e?: MouseEvent) {
    if (!e || !this.waperRef.current?.contains(e.target as any)) {
      this.setState({
        showCalendar: isShow,
      });
    }
  }

  override async onKeyPress(e: KeyboardEvent) {
    if (e.which === 32 && !this.state.disabled && !this.state.readonly) {
      if (!this.state.disabled && !this.state.showCalendar) {
        this.setState({
          showCalendar: true,
        });
      }
    } else if (e.key && e.which !== 13) {
      if (e.key === "/") {
        let input = this.previewValue;
        let posCurrent = getSelection(e.target as any as HTMLInputElement);
        let fristPath = input.indexOf("/") || 0;
        let lastPath = input.lastIndexOf("/") || 0;

        //nhập ô đầu tiên
        if (posCurrent.start <= fristPath || fristPath < 0) {
          this.ref?.current?.setSelectionRange(fristPath + 1, lastPath);
        }
        //nhập ô thứ 2
        else if (posCurrent.start <= lastPath) {
          this.ref?.current?.setSelectionRange(lastPath + 1, input.length);
        } else {
          this.ref?.current?.setSelectionRange(0, fristPath);
        }
        e.preventDefault();
      } else if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    }
    this.props?.onKeyPress?.(e);
  }

  override async onKeyDown(e: KeyboardEvent) {
    if (this.ref?.current && e.key?.toLowerCase() === "tab") {
      let input = this.previewValue;
      let posCurrent = getSelection(this.ref.current);
      let fristPath = input.indexOf("/") || 0;
      let lastPath = input.lastIndexOf("/") || 0;

      //nhập ô đầu tiên
      if (posCurrent.start <= fristPath || fristPath < 0) {
        if (!e.shiftKey) {
          this.ref?.current.setSelectionRange(fristPath + 1, lastPath);
          e.preventDefault();
        }
      }
      //nhập ô thứ 2
      else if (posCurrent.start <= lastPath) {
        if (e.shiftKey) {
          this.ref?.current.setSelectionRange(0, fristPath);
        } else {
          this.ref?.current.setSelectionRange(lastPath + 1, input.length);
        }
        e.preventDefault();
      } else {
        if (e.shiftKey) {
          this.ref?.current.setSelectionRange(fristPath + 1, lastPath);
          e.preventDefault();
        }
      }
    }
    this.props.onKeyDown?.(e);
  }

  override shouldComponentUpdate(
    nextProps: IDatePickerProps,
    nextState: IDatePickerState
  ) {
    if (this.state.showCalendar !== nextState.showCalendar) {
      return true;
    }
    return super.shouldComponentUpdate(nextProps, nextState);
  }

  render() {
    return (
      <>
        <div
          className={buildClass([
            "mtl-date-picker-wapper",
            this.props.className,
          ])}
          ref={this.waperRef}
        >
          <input
            ref={this.ref}
            type="text"
            id={this.id}
            name={this.props.name}
            className={buildClass([
              "mtl-date-picker",
              this.props.className,
              this.state.error ? "invalid" : "",
            ])}
            style={this.props.style}
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
          <button
            type="button"
            className="btn-calendar"
            onClick={() => {
              this.setState({
                showCalendar: !this.state.showCalendar,
              });
            }}
            disabled={this.state.disabled || this.state.readonly}
          ></button>
        </div>
        {this.state.error ? (
          <span className="invalid-msg">{this.state.error}</span>
        ) : null}
        {this.state.showCalendar &&
        !this.state.disabled &&
        !this.state.readonly ? (
          <Popup
            parentRef={this.waperRef}
            showChange={this.onShowChange.bind(this)}
          >
            <Calendar
              value={this.value}
              onSelected={this.onSelectionChange.bind(this)}
            />
          </Popup>
        ) : null}
      </>
    );
  }
}
export default DatePicker;
