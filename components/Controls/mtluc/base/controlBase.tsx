import {
  CSSProperties,
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  Component,
  RefObject,
  createRef,
} from "react";
import { IFormContext } from "../Form/form-context";

export type ControlType = "text" | "check" | "date" | "radio";

/**
 * Base control
 */
export abstract class BaseControl<
  P extends IControlProps,
  S extends IControlState<P>
> extends Component<P, S> {
  public type: ControlType = "text";

  public ref: RefObject<any>;
  public id: string = "";
  public name: string = "";

  /**
   * contructor
   */
  constructor(props: P, ctx: any) {
    super(props);
    this.id = props.id || props.name;
    this.name = props.name;
    this.context = ctx;
    this.state = this.initState(props);
    this.ref = createRef<any>();
  }

  /**
   * Xử lý init state dựa trên props
   * @param props
   * @returns
   */
  initState(props: P) {
    return {
      _props: { ...props },
      value: props.value || props.defaultValue || "",
      readonly: props.readonly || false,
      disabled: props.disabled || false,
      error: "",
    } as S;
  }

  get value() {
    return this.state.value;
  }

  set value(v: any) {
    if (this.value !== v || !this.value) {
      this.setState({ value: this.setElementValue(v) });
      this.error = this.validate(v);
    }
  }

  get error() {
    return this.state.error;
  }

  set error(v: any) {
    this.setState({ error: v });
  }

  get disabled() {
    return this.state.disabled || false;
  }

  set disabled(v: boolean) {
    this.setState({ disabled: v });
  }

  get readonly() {
    return this.state.readonly || false;
  }

  set readonly(v: boolean) {
    this.setState({ readonly: v });
  }

  setElementValue(v: any): any {
    if (this.ref.current) {
      this.ref.current.value = v;
    }
    return v;
  }

  componentDidMount(): void {
    if (this.context && (this.context as IFormContext).register) {
      (this.context as IFormContext).register(this);
    }
    this.setElementValue(this.value);
  }

  componentWillUnmount(): void {
    if (this.context && (this.context as IFormContext).unRegister) {
      (this.context as IFormContext).unRegister(this.id);
    }
  }

  shouldComponentUpdate(
    nextProps: IControlProps,
    nextState: IControlState<IControlProps>
  ) {
    if (this.props.value !== nextProps.value) {
      this.setElementValue(nextProps.value);
      return true;
    }

    if (
      this.state.disabled !== nextState.disabled ||
      this.props.disabled !== nextProps.disabled
    ) {
      return true;
    }

    if (
      this.state.readonly !== nextState.readonly ||
      this.props.readonly !== nextProps.readonly
    ) {
      return true;
    }

    if (this.state.error !== nextState.error) {
      return true;
    }
    return false;
  }

  validate(value: any): string {
    if (this.props.required && !value?.toString()?.trim()) {
      return "Trường này không được để trống";
    }
    return "";
  }

  /**
   * validate
   * @param e
   */
  onValidate(value: any): string {
    return this.validate(value) || this.props.onValidate?.(value) || "";
  }

  /**
   * Khi thay đổi giá trị
   * @param e
   */
  async onChange(e: ChangeEvent) {
    let _value = (e.target as any).value;
    let oldValue = this.value;
    if (!_value && this.props.defaultValue) {
      _value = this.props.defaultValue;
    }

    if (_value !== oldValue) {
      this.value = _value;
    }
    await this.props.onChange?.(e, this, _value);

    if (_value !== oldValue) {
      (this.context as IFormContext)?.valueChange?.(e, oldValue, _value, this);
    }
  }

  /**
   * Sự kiện blur khỏi control
   * @param e
   * @returns
   */
  async onBlur(e: FocusEvent) {
    const value = this.ref?.current?.value;
    const error = this.onValidate(value);
    if (error !== this.error) {
      this.error = error;
    }
    this.props?.onBlur?.(e);
  }

  /**
   * Sự kiện Focus vào control
   * @param e
   */
  async onFocus(e: FocusEvent) {
    this.ref?.current?.select?.();
    this.props?.onFocus?.(e);
  }

  /**
   * Focus vào control
   */
  focus() {
    this.ref?.current?.focus?.();
    this.ref?.current?.select?.();
  }

  /**
   * Sự kiện click control
   * @param e
   * @returns
   */
  async onClick(e: MouseEvent) {
    this.props?.onClick?.(e);
  }

  /**
   * Sự kiện copy dữ liệu control
   * @param e
   * @returns
   */
  async onCopy(e: ClipboardEvent) {
    this.props?.onCopy?.(e);
  }

  /**
   * Sự kiện Cut giá trị control
   * @param e
   * @returns
   */
  async onCut(e: ClipboardEvent) {
    this.props?.onCut?.(e);
  }

  /**
   * Sự kiện nhập giá trị vào control
   * @param e
   * @returns
   */
  async onInput(e: FormEvent) {
    this.props?.onInput?.(e);
  }

  /**
   * Sự kiện keydowwn
   * @param e
   * @returns
   */
  async onKeyDown(e: KeyboardEvent) {
    this.props?.onKeyDown?.(e);
  }

  /**
   * Sự kiện up
   * @param e
   * @returns
   */
  async onKeyUp(e: KeyboardEvent) {
    this.props?.onKeyUp?.(e);
  }

  /**
   * Sự kiện press
   * @param e
   * @returns
   */
  async onKeyPress(e: KeyboardEvent) {
    this.props?.onKeyPress?.(e);
  }
}

/**
 * Base control props
 */
export interface IControlProps {
  /**
   * Id control
   */
  id?: string;

  /**
   * Tên control
   */
  name: string;

  /**
   * Giá trị mặc định
   */
  defaultValue?: any;

  /**
   * Giá trị
   */
  value?: any;

  /**
   *disabled
   */
  disabled?: boolean;

  /**
   * readonly
   */
  readonly?: boolean;

  /**
   * required
   */
  required?: boolean;

  style?: CSSProperties;

  className?: string;

  placeholder?: string;

  autoComplete?: "on" | "off" | "new-password";

  /**
   * Sự kiện thay đổi giá trị
   * @param e ChangeEvent
   * @returns
   */
  onChange?: (
    e: ChangeEvent,
    ctr: BaseControl<any, any>,
    newValue: any,
    opt?: any
  ) => void | Promise<void>;

  /**
   * Sự kiện blur khỏi control
   * @param e
   * @returns
   */
  onBlur?: (e: FocusEvent) => void | Promise<void>;

  /**
   * Sự kiện click control
   * @param e
   * @returns
   */
  onClick?: (e: MouseEvent) => void | Promise<void>;

  /**
   * Sự kiện copy dữ liệu control
   * @param e
   * @returns
   */
  onCopy?: (e: ClipboardEvent) => void | Promise<void>;

  /**
   * Sự kiện Cut giá trị control
   * @param e
   * @returns
   */
  onCut?: (e: ClipboardEvent) => void | Promise<void>;

  /**
   * Sự kiện Focus vào control
   * @param e
   * @returns
   */
  onFocus?: (e: FocusEvent) => void | Promise<void>;

  /**
   * Sự kiện nhập giá trị vào control
   * @param e
   * @returns
   */
  onInput?: (e: FormEvent) => void | Promise<void>;

  /**
   * Sự kiện keydowwn
   * @param e
   * @returns
   */
  onKeyDown?: (e: KeyboardEvent) => void | Promise<void>;

  /**
   * Sự kiện up
   * @param e
   * @returns
   */
  onKeyUp?: (e: KeyboardEvent) => void | Promise<void>;

  /**
   * Sự kiện press
   * @param e
   * @returns
   */
  onKeyPress?: (e: KeyboardEvent) => void | Promise<void>;

  /**
   * validate
   * @param e
   * @returns
   */
  onValidate?: (value: any) => string;
}

/**
 * Base control State
 */
export interface IControlState<P extends IControlProps> {
  /**
   * Giá trị props cũ
   */
  _props: P;

  /**
   * Giá trị của control
   */
  value: any;

  /**
   *disabled
   */
  disabled?: boolean;

  /**
   * readonly
   */
  readonly?: boolean;

  /**
   * required
   */
  required?: boolean;

  /**
   * Error
   */
  error?: string;
}
