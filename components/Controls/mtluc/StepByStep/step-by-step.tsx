import { buildClass } from "../base/common";

const StepByStep = ({
  steps,
  stepActiveIndex,
}: {
  steps: IStep[];
  stepActiveIndex: number;
}) => {
  return (
    <div className="mtl-steps">
      {steps.map((x, idx) => {
        return (
          <div
            key={x.No}
            className={buildClass([
              "mtl-step",
              idx <= stepActiveIndex ? "active" : "",
            ])}
          >
            <div className="mtl-step-no">{x.No}</div>
            {x.Title || x.Description ? (
              <div>
                {x.Title ? (
                  <div className="mtl-step-title">{x.Title}</div>
                ) : null}
                {x.Description ? (
                  <div className="mtl-step-description">{x.Description}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
export default StepByStep;

export interface IStep {
  No: number;
  Title?: string;
  Description?: string;
}
