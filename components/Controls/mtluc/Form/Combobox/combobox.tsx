import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  RefObject,
  createRef,
} from "react";
import Popup from "../../Popup/popup";
import { buildClass, fireMouseDown } from "../../base/common";
import {
  BaseControl,
  IControlProps,
  IControlState,
} from "../../base/controlBase";
import MyFormContext, { FormContext } from "../form-context";

export interface IComboboxProps extends IControlProps {
  dataSource?: any[];
  fieldId?: string;
  fieldName?: string;
  multipleSelect?: boolean;
  unFreeText?: boolean;
  renderOptions?: (onClick: (row: any) => void) => ReactElement;
  renderItem?: (item: any, that: ComboBox) => ReactElement;
  onChange?: (
    e: ChangeEvent,
    ctr: BaseControl<any, any>,
    newValue: any,
    opt?: { value: any; row: any }
  ) => void;
  getDisplay?: (rows: any) => string;

  onMouseDownPopup?: (e: MouseEvent) => void;
}

export interface IComboboxState extends IControlState<IComboboxProps> {
  dataSource: any[];
  source: any[];
  showOptions: boolean;
  rowFocus: any;
}

class ComboBox extends BaseControl<IComboboxProps, IComboboxState> {
  static contextType = FormContext;

  waperRef!: RefObject<HTMLDivElement>;
  optionsRef!: RefObject<HTMLDivElement>;

  /**
   *
   */
  constructor(props: IComboboxProps, ctx: any) {
    super(props, ctx);
    this.waperRef = createRef<HTMLDivElement>();
    this.optionsRef = createRef<HTMLDivElement>();
  }

  static getDerivedStateFromProps(
    nextProps: IComboboxProps,
    prevState: IControlState<IComboboxProps>
  ) {
    const newState: any = {};
    if (
      nextProps.value != undefined &&
      nextProps.value !== prevState._props.value
    ) {
      newState.value = nextProps.value;
    }

    if (prevState._props.disabled !== nextProps.disabled) {
      newState.disabled = nextProps.disabled;
    }

    if (prevState._props.readonly !== nextProps.readonly) {
      newState.readonly = nextProps.readonly;
    }

    if (prevState._props.dataSource !== nextProps.dataSource) {
      newState.source = nextProps.dataSource;
    }

    if (Object.keys(newState).length) {
      return {
        ...newState,
        _props: { ...nextProps },
      };
    } else {
      return null;
    }
  }

  override shouldComponentUpdate(
    nextProps: IComboboxProps,
    nextState: IComboboxState
  ) {
    if (
      this.state.showOptions !== nextState.showOptions &&
      !nextState.disabled &&
      !nextState.readonly
    ) {
      return true;
    }

    if (
      this.state.source !== nextState.source &&
      nextState.showOptions &&
      !nextState.disabled &&
      !nextState.readonly
    ) {
      return true;
    }

    if (
      this.state.rowFocus !== nextState.rowFocus &&
      nextState.showOptions &&
      !nextState.disabled &&
      !nextState.readonly
    ) {
      return true;
    }

    setTimeout(() => {
      this.setElementValue(nextState.value);
    });
    return super.shouldComponentUpdate(nextProps, nextState);
  }

  override initState(props: IComboboxProps) {
    return {
      ...super.initState(props),
      showOptions: false,
      rowFocus: "",
      source: props.dataSource || [],
    };
  }

  override setElementValue(v: any): any {
    if (this.ref.current) {
      this.ref.current.value = this.getDisplay(this.getRecordByValue(v));
    }
    return v;
  }

  get fieldName() {
    return this.props.fieldName;
  }

  get fieldId() {
    return this.props.fieldId;
  }

  getDisplay(rows: any) {
    if (this.props.getDisplay) {
      if (rows) {
        return this.props.getDisplay(rows);
      }
    }

    if (Array.isArray(rows)) {
      let result: string[] = [];
      rows.forEach((x) => {
        if (x) {
          if (typeof x == "string") {
            result.push(x || "");
          } else if (this.fieldName) {
            result.push(x[this.fieldName] || "");
          } else if (this.fieldId) {
            result.push(x[this.fieldId] || "");
          }
        }
      });

      return result.join(", ");
    } else if (rows) {
      if (typeof rows == "string") {
        return rows || "";
      }

      if (this.fieldName) {
        return rows[this.fieldName] || "";
      }

      if (this.fieldId) {
        return rows[this.fieldId] || "";
      }

      return rows || "";
    }
    return "";
  }

  getRecordByValue(value: any) {
    // eslint-disable-next-line eqeqeq
    if (Array.isArray(value)) {
      return this.props.dataSource?.filter(
        (x) => (value as any[]).indexOf(this.getValueInRow(x)) >= 0
      );
    } else {
      return this.props.dataSource?.find((x) => this.getValueInRow(x) == value);
    }
  }

  getValueInRow(row: any) {
    if (typeof row == "string") {
      return row || "";
    }

    if (this.fieldId) {
      if (typeof row?.[this.fieldId] == "string") {
        return row?.[this.fieldId]?.trim?.() || "";
      } else {
        return row?.[this.fieldId];
      }
    }
    return "";
  }

  onShowChange(isShow: boolean, e?: MouseEvent) {
    if (!e || !this.waperRef.current?.contains(e.target as any)) {
      this.setShowOptions(isShow);
    }
  }
  handlerSelectRow(row: any, e?: React.MouseEvent) {
    const oldValue = this.value;
    let value: any = "";
    let hasColspan = true;
    if (this.props.multipleSelect) {
      let idValue = this.getValueInRow(row);
      value = [...(this.value || [])];
      if (e?.ctrlKey) {
        if (value.indexOf(idValue) < 0) {
          value.push(idValue);
        } else {
          value = value.filter((x: any) => x !== idValue);
        }
        hasColspan = false;
      } else if (e?.shiftKey && value.length) {
        let idxStart = 0;
        let idxEnd = 0;

        idxStart = this.state.source?.findIndex(
          (x) => this.getValueInRow(x) === value[0]
        );
        idxEnd = this.state.source?.findIndex(
          (x) => this.getValueInRow(x) === idValue
        );
        value = [];
        this.state.source?.forEach((x, idx) => {
          if (idxStart <= idxEnd) {
            if (idx >= idxStart && idx <= idxEnd) {
              value.push(this.getValueInRow(x));
            }
          } else {
            if (idx <= idxStart && idx >= idxEnd) {
              value.push(this.getValueInRow(x));
            }
          }
        });
        hasColspan = false;
      } else {
        value = [idValue];
      }
    } else {
      value = this.getValueInRow(row);
    }
    this.value = value;
    this.focus();
    this.setShowOptions(false);
    if (!hasColspan) {
      setTimeout(() => {
        this.setShowOptions(true);
      });
    } else {
    }
    this.props?.onChange?.(
      {
        target: this.ref?.current,
      } as any,
      this,
      value,
      {
        value: value,
        row: row,
      }
    );
    (this.context as MyFormContext)?.valueChange?.(
      {
        target: this.ref?.current,
      } as any,
      oldValue,
      value,
      this
    );
  }

  override async onBlur(e: FocusEvent<Element, Element>) {
    const error = this.onValidate(this.value);
    if (error !== this.error) {
      this.error = error;
    }
    this.ref.current.value = this.getDisplay(this.getRecordByValue(this.value));
    this.props?.onBlur?.(e);
  }

  scrollIntoView(inTop: boolean = false) {
    if (this.optionsRef.current) {
      const el = this.optionsRef.current.getElementsByClassName(
        "focus-row"
      )?.[0] as HTMLElement;
      if (el) {
        const scrollTop = this.optionsRef.current.scrollTop;
        const viewHeight = this.optionsRef.current.offsetHeight;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (!(top > scrollTop && top + height <= scrollTop + viewHeight)) {
          if (inTop) {
            this.optionsRef.current.scrollTo(
              this.optionsRef.current.scrollLeft,
              top
            );
          } else {
            this.optionsRef.current.scrollTo(
              this.optionsRef.current.scrollLeft,
              top + height - viewHeight
            );
          }
        }
      }
    }
  }

  setShowOptions(isShow: boolean) {
    if (isShow === true) {
      const source: any[] = this.props.dataSource || [];
      const row =
        source?.find((x) => this.getValueInRow(x) === this.state.value) ||
        source?.[0];
      this.setState({
        source: source,
        rowFocus: this.getValueInRow(row),
        showOptions: isShow,
      });
    } else {
      this.setState({
        showOptions: isShow,
      });
    }
  }

  override async onKeyDown(e: KeyboardEvent<Element>) {
    if (!this.state.readonly && !this.state.disabled) {
      if (e.which === 40) {
        if (!this.state.showOptions) {
          this.setShowOptions(true);
        } else {
          const idx = this.state.source.findIndex(
            (x) => this.getValueInRow(x) === this.state.rowFocus
          );
          if (idx < this.state.source.length - 1) {
            this.setState({
              rowFocus: this.getValueInRow(this.state.source[idx + 1]),
            });
            setTimeout(() => {
              this.scrollIntoView();
            }, 1);
          }
        }
        e.preventDefault();
      } else if (e.which === 38) {
        const idx = this.state.source.findIndex(
          (x) => this.getValueInRow(x) === this.state.rowFocus
        );
        if (idx > 0) {
          this.setState({
            rowFocus: this.getValueInRow(this.state.source[idx - 1]),
          });
          setTimeout(() => {
            this.scrollIntoView(true);
          }, 1);
        }
        e.preventDefault();
      } else if (e.which === 13 && this.state.showOptions) {
        this.handlerSelectRow(this.getRecordByValue(this.state.rowFocus));
        e.preventDefault();
      }
    }
    super.onKeyDown(e);
  }

  override async onChange(e: ChangeEvent) {
    let _value = (e.target as any).value;
    if (!_value) {
      if (this.props.multipleSelect) {
        this.value = [];
      } else {
        this.value = "";
      }
      this.setState({
        source: this.props.dataSource || [],
      });
    } else {
      let _newSource =
        this.props.dataSource?.filter((x) => {
          return (
            this.getDisplay(x).toLowerCase().indexOf(_value.toLowerCase()) >= 0
          );
        }) || [];

      if (!_newSource.length) {
        _newSource = this.props.dataSource || [];
      }
      this.setState({
        source: _newSource,
      });
      if (!this.state.showOptions) {
        this.setState({
          showOptions: true,
        });
      }
    }
    this.props.onChange?.(e, this, _value);
  }

  checkItemSelected(item: any) {
    if (Array.isArray(this.value)) {
      return this.value.indexOf(this.getValueInRow(item)) >= 0;
    } else {
      return this.getValueInRow(item) === this.value;
    }
  }

  render() {
    return (
      <>
        <div
          ref={this.waperRef}
          className={buildClass(["mtl-combobox-wapper", this.props.className])}
        >
          <input
            ref={this.ref}
            type="text"
            id={this.id}
            name={this.props.name}
            className={buildClass([
              "mtl-combobox",
              this.state.error ? "invalid" : "",
              this.props.className,
            ])}
            placeholder={this.props.placeholder || "-- Chọn --"}
            style={this.props.style}
            readOnly={this.state.readonly || this.props.unFreeText}
            disabled={this.state.disabled}
            autoComplete="off"
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
            className="btn-dropdown"
            type="button"
            onClick={(e) => {
              this.setShowOptions(!this.state.showOptions);
              this.focus?.();
              if (this.waperRef.current) {
                fireMouseDown(this.waperRef.current);
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={this.state.disabled || this.state.readonly}
          ></button>
        </div>
        {this.state.error ? (
          <span className="invalid-msg">{this.state.error}</span>
        ) : null}
        {this.state.showOptions &&
        !this.state.disabled &&
        !this.state.readonly ? (
          <Popup
            parentRef={this.waperRef}
            showChange={(e) => this.onShowChange(e)}
          >
            <>
              {this.props.renderOptions ? (
                this.props.renderOptions(this.handlerSelectRow.bind(this))
              ) : (
                <div
                  ref={this.optionsRef}
                  className="custom-scroll options-wap"
                  style={{
                    width: this.waperRef?.current?.clientWidth,
                  }}
                  onMouseDown={(e) => {
                    this.props.onMouseDownPopup?.(e);
                  }}
                >
                  {this.state.source.map((row) => {
                    return this.props.renderItem ? (
                      this.props.renderItem(row, this)
                    ) : (
                      <div
                        key={this.fieldId ? row[this.fieldId] : row}
                        className={buildClass([
                          "option-item",
                          this.checkItemSelected(row) ? "selected" : "",
                          this.getValueInRow(row) === this.state.rowFocus
                            ? "focus-row"
                            : "",
                        ])}
                        title={this.getDisplay(row)}
                        onClick={(e) => this.handlerSelectRow(row, e)}
                      >
                        {this.getDisplay(row)?.toString()}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          </Popup>
        ) : null}
      </>
    );
  }
}
export default ComboBox;
