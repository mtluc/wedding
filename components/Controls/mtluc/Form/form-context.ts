import { ChangeEvent, createContext } from "react";
import { BaseControl, IControlProps, IControlState } from "../base/controlBase";
import { IRadioProps } from "./Radio/radio";

export const FormContext = createContext<IFormContext>({} as IFormContext);

class MyFormContext implements IFormContext {
  constructor(
    valueChange?: (
      e: ChangeEvent,
      oldValue: any,
      newValue: any,
      control: BaseControl<IControlProps, IControlState<IControlProps>>
    ) => void
  ) {
    if (valueChange) {
      this.valueChange = valueChange;
    }
  }

  controls: BaseControl<IControlProps, IControlState<IControlProps>>[] = [];

  valueChange!: (
    e: ChangeEvent,
    oldValue: any,
    newValue: any,
    control: BaseControl<IControlProps, IControlState<IControlProps>>
  ) => void;

  register(control: BaseControl<IControlProps, IControlState<IControlProps>>) {
    const ctridx = this.controls.findIndex((x) => x.id === control.id);
    if (ctridx >= 0) {
      this.controls.splice(ctridx, 1);
    }
    this.controls.push(control);
  }

  unRegister(id: string) {
    const ctridx = this.controls.findIndex((x) => x.id === id);
    if (ctridx >= 0) {
      this.controls.splice(ctridx, 1);
    }
  }

  focus(id: string) {
    this.getControl(id)?.focus?.();
  }

  async setValue(name: string, value: any) {
    this.controls.forEach((control) => {
      if (control.name === name) {
        switch (control.type) {
          case "check":
            control.value = value ? true : false;
            break;
          case "radio":
            // eslint-disable-next-line
            if (value == (control.props as IRadioProps).optionValue) {
              control.value = true;
            } else {
              control.value = false;
            }
            break;
          default:
            control.value = value;
            break;
        }
      }
    });
  }

  getValue(fieldName: string): object {
    let value: any = undefined;
    this.controls.forEach((control) => {
      if (control.name === fieldName) {
        switch (control.type) {
          case "check":
            value = control.value ? true : false;
            break;
          case "radio":
            if (control.value) {
              value = (control.props as IRadioProps).optionValue;
            }
            break;
          default:
            value = control.value;
            break;
        }
      }
    });
    return value;
  }

  getValues() {
    const result = {} as any;
    this.controls.forEach((control) => {
      if (control) {
        switch (control.type) {
          case "check":
            result[control.name] = control.value ? true : false;
            break;
          case "radio":
            if (control.value) {
              result[control.name] = (control.props as IRadioProps).optionValue;
            }
            break;
          default:
            result[control.name] = control.value;
            break;
        }
      }
    });
    return result;
  }

  async clearError() {
    this.controls.forEach((control) => {
      control.error = "";
    });
  }

  async setError(id: string, error: any) {
    const control = this.getControl(id);
    if (control) {
      control.error = error;
    } else {
      // eslint-disable-next-line no-throw-literal
      throw `doesn't exist control ${id}`;
    }
  }

  getError(name: string) {
    this.controls.forEach((control) => {
      if (control.name === name && control.error) {
        return control.error;
      }
    });
    return "";
  }

  getErrors() {
    const result = {} as any;
    this.controls.forEach((control) => {
      if (control) {
        if (
          !Object.prototype.hasOwnProperty.call(result, control.name) &&
          control.error
        ) {
          result[control.name] = control.error;
        }
      }
    });
    return Object.keys(result).length > 0 ? result : undefined;
  }

  validate(name: string) {
    let error = "";
    this.controls.forEach((control) => {
      if (control?.name === name) {
        const _error = control.onValidate?.(control.value);
        if (_error) {
          error = _error;
          control.error = _error;
        }
      }
    });
    return error;
  }

  validates() {
    const result = {} as any;
    this.controls.forEach((control) => {
      if (control) {
        let error = control.validate?.(control.value);
        if (
          !Object.prototype.hasOwnProperty.call(result, control.name) &&
          error
        ) {
          result[control.name] = error;
          control.error = error;
        }
      }
    });
    return Object.keys(result).length > 0 ? result : undefined;
  }

  getControl(
    id: string
  ): BaseControl<IControlProps, IControlState<IControlProps>> | undefined {
    return (
      this.controls.find((x) => x.id === id) ||
      this.controls.find((x) => x.name === id)
    );
  }

  getControlOf<T>(id: string) {
    return this.getControl(id) as T;
  }

  setDisabled(name: string, disabled: boolean) {
    for (let i = 0; i < this.controls.length; i++) {
      if (this.controls[i]?.name === name) {
        this.controls[i].disabled = disabled;
      }
    }
  }

  setReadonly(fieldName: string, readonly: boolean) {
    for (let i = 0; i < this.controls.length; i++) {
      if (this.controls[i]?.name === fieldName) {
        this.controls[i].readonly = readonly;
      }
    }
  }

  setDisabledById(id: string, disabled: boolean) {
    const control = this.getControl(id);
    if (control) {
      control.disabled = disabled;
    }
  }

  setReadonlyById(id: string, readonly: boolean) {
    const control = this.getControl(id);
    if (control) {
      control.disabled = readonly;
    }
  }

  setDisabledAll(disabled: boolean) {
    for (let i = 0; i < this.controls.length; i++) {
      if (this.controls[i]) this.controls[i].disabled = disabled;
    }
  }

  setReadonlyAll(readonly: boolean) {
    for (let i = 0; i < this.controls.length; i++) {
      if (this.controls[i]) this.controls[i].readonly = readonly;
    }
  }
}

export default MyFormContext;

export interface IFormContext {
  controls: BaseControl<IControlProps, IControlState<IControlProps>>[];
  valueChange?: (
    e: ChangeEvent,
    oldValue: any,
    newValue: any,
    control: BaseControl<IControlProps, IControlState<IControlProps>>
  ) => void;

  register: (
    control: BaseControl<IControlProps, IControlState<IControlProps>>
  ) => void;

  unRegister: (id: string) => void;
  focus: (id: string) => void;

  setValue: (id: string, value: any) => Promise<void>;
  getValue: (fieldName: string) => object;
  getValues: () => object;

  clearError: () => Promise<void>;
  setError: (id: string, value: any) => Promise<void>;
  getError: (fieldName: string) => string;
  getErrors: () => object;

  validate: (fieldName: string) => string;
  validates: () => object;

  getControl: (
    id: string
  ) => BaseControl<IControlProps, IControlState<IControlProps>> | undefined;
  getControlOf: <T>(id: string) => T;

  setDisabled: (fieldName: string, disabled: boolean) => void;
  setReadonly: (fieldName: string, readonly: boolean) => void;
  setDisabledById: (id: string, disabled: boolean) => void;
  setReadonlyById: (id: string, readonly: boolean) => void;
  setDisabledAll: (disabled: boolean) => void;
  setReadonlyAll: (readonly: boolean) => void;
}
