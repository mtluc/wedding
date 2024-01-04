import { Component, CSSProperties, FormEvent, ReactNode } from "react";
import MyFormContext, { FormContext, IFormContext } from "./form-context";

export interface IFormProps {
  children?: React.ReactNode;
  ctx?: IFormContext;
  action?: string;
  name?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  class?: string;
  onSubmit?: (e: FormEvent, value: any, form: IFormContext) => void;
  styles?: CSSProperties;
}

export interface IFormState {
  ctx: IFormContext;
}

class Form extends Component<IFormProps, IFormState> {
  /**
   *
   */
  constructor(props: IFormProps) {
    super(props);
    this.state = {
      ctx: props.ctx || new MyFormContext(),
    };
  }

  async hanlerSubmit(e: FormEvent) {
    try {
      await this.state.ctx.clearError();
      const error = this.state.ctx.validates();
      if (!error) {
        this.props.onSubmit?.(e, this.state.ctx.getValues(), this.state.ctx);
      } else {
        e.preventDefault();
        for (const key in error) {
          if (Object.prototype.hasOwnProperty.call(error, key)) {
            this.state.ctx.focus(key);
            return;
          }
        }
      }
    } catch (error) {
      console.error(error);
      e.preventDefault();
    }
  }

  componentDidMount(): void {
    if (this.state.ctx?.controls?.length) {
      setTimeout(() => {
        if(this.state.ctx.controls?.[0]?.id){
          this.state.ctx.focus(this.state.ctx.controls[0].id);
        }
      }, 100);
    }
  }

  render(): ReactNode {
    return (
      <FormContext.Provider value={this.state.ctx}>
        <form
          action={this.props.action}
          method={this.props.method}
          className={this.props.class}
          onSubmit={this.hanlerSubmit.bind(this)}
          style={this.props.styles}
          name={this.props.name}
        >
          {this.props.children}
        </form>
      </FormContext.Provider>
    );
  }
}
export default Form;
