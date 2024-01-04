import { PureComponent } from "react";
import { buildClass } from "../../../base/common";

export interface ICalendarProps {
  value?: Date;
  onSelected?: (value: Date) => void;
}

export interface ICalendarState {
  value?: Date;
  selectType: "day" | "month" | "year";
  currMonth: number;
  currYear: number;
  days: IDay[];
  focusDay: Date;
}

class Calendar extends PureComponent<ICalendarProps, ICalendarState> {
  constructor(props: ICalendarProps) {
    super(props);
    this.state = {
      ...this.getCurrentData(new Date(), props.value),
      selectType: "day",
    };
  }

  getCurrentData(focusDay: Date, value?: Date) {
    let dateNow = new Date(),
      currMonth = focusDay.getMonth(),
      currYear = focusDay.getFullYear(),
      firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(),
      dayofNextMonth = 42 - lastDateofMonth - firstDayofMonth,
      days: IDay[] = [];

    for (let i = firstDayofMonth; i > 0; i--) {
      days.push({
        day: lastDateofLastMonth - i + 1,
        month: currMonth === 0 ? 11 : currMonth - 1,
        year: currMonth === 0 ? currYear - 1 : currYear,
        inActive: true,
        isToDay: false,
        isSelected: false,
      });
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      days.push({
        day: i,
        month: currMonth,
        year: currYear,
        inActive: false,
        isToDay: false,
        isSelected: false,
      });
    }

    for (let i = 1; i <= dayofNextMonth; i++) {
      days.push({
        day: i,
        month: currMonth === 11 ? 0 : currMonth + 1,
        year: currMonth === 11 ? currYear + 1 : currYear,
        inActive: true,
        isToDay: false,
        isSelected: false,
      });
    }

    // eslint-disable-next-line array-callback-return
    days.map((day) => {
      if (
        day.day === dateNow.getDate() &&
        day.month === dateNow.getMonth() &&
        day.year === dateNow.getFullYear()
      ) {
        day.isToDay = true;
      }

      if (
        day.day === value?.getDate() &&
        day.month === value?.getMonth() &&
        day.year === value?.getFullYear()
      ) {
        day.isSelected = true;
      }
    });

    return {
      currMonth,
      currYear,
      days,
      focusDay,
      value: this.shortDate(value),
    };
  }

  changeSelectType() {
    if (this.state.selectType === "day") {
      this.setState({
        selectType: "month",
      });
    } else if (this.state.selectType === "month") {
      this.setState({
        selectType: "year",
      });
    }
  }

  clickBackMonth() {
    let month = this.state.currMonth,
      year = this.state.currYear;
    if (this.state.selectType === "year") {
      year = year - 10;
    } else if (this.state.selectType === "month") {
      year = year - 1;
    } else {
      month = month - 1;
    }

    this.setState(
      this.getCurrentData(new Date(year, month, 1), this.state.value)
    );
  }

  shortDate(date?: Date) {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    return date;
  }

  clickToDay() {
    const date = new Date();
    const newState = this.getCurrentData(date, date);
    this.setState({
      ...newState,
      selectType: "day",
    });
    this.props.onSelected?.(newState.value as Date);
  }

  clickNextMonth() {
    let month = this.state.currMonth,
      year = this.state.currYear;
    if (this.state.selectType === "year") {
      year = year + 10;
    } else if (this.state.selectType === "month") {
      year = year + 1;
    } else {
      month = month + 1;
    }

    this.setState(
      this.getCurrentData(new Date(year, month, 1), this.state.value)
    );
  }

  clickDay(day: IDay) {
    const date = new Date(day.year, day.month, day.day);
    this.setState({
      ...this.getCurrentData(date, date),
    });
    this.props.onSelected?.(date);
  }

  selectMonth = (month: number) => {
    this.setState({
      ...this.getCurrentData(
        new Date(this.state.currYear, month - 1, 1),
        this.state.value
      ),
      selectType: "day",
    });
  };

  selectYear(year: number) {
    this.setState({
      ...this.getCurrentData(
        new Date(year, this.state.currMonth, 1),
        this.state.value
      ),
      selectType: "month",
    });
  }

  render() {
    return (
      <div className="mtl-calendar">
        <div className="mtl-calendar-header">
          <div className="current-date">
            <button type="button" onClick={this.changeSelectType.bind(this)}>
              {this.state.selectType === "day"
                ? `Tháng ${this.state.currMonth + 1} năm ${this.state.currYear}`
                : this.state.selectType === "month"
                ? `Năm ${this.state.currYear}`
                : `${Math.floor(this.state.currYear / 10) * 10} - ${
                    Math.floor(this.state.currYear / 10) * 10 + 10
                  }`}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn-back"
              onClick={this.clickBackMonth.bind(this)}
            ></button>
            <button
              type="button"
              className="btn-today"
              onClick={this.clickToDay.bind(this)}
            >
              Hôm nay
            </button>
            <button
              type="button"
              className="btn-next"
              onClick={this.clickNextMonth.bind(this)}
            ></button>
          </div>
        </div>

        <div className="calendar-main">
          {this.state.selectType === "day" ? (
            <>
              <ul className="weeks">
                <li>CN</li>
                <li>T2</li>
                <li>T3</li>
                <li>T4</li>
                <li>T5</li>
                <li>T6</li>
                <li>T7</li>
              </ul>
              <ul className="days">
                {this.state.days.map((day, idx) => {
                  return (
                    <li
                      key={idx}
                      className={buildClass([
                        day.inActive ? "inactive" : "",
                        day.isToDay ? "is-today" : "",
                        day.isSelected ? "active" : "",
                      ])}
                      onClick={() => {
                        this.clickDay(day);
                      }}
                    >
                      <button type="button">{day.day}</button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : this.state.selectType === "month" ? (
            <ul className="months">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((idx) => {
                return (
                  <li key={idx}>
                    <button onClick={() => this.selectMonth(idx)}>
                      Tháng {idx}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="years">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
                return (
                  <li key={idx}>
                    <button
                      onClick={() =>
                        this.selectYear(
                          Math.floor(this.state.currYear / 10) * 10 + idx
                        )
                      }
                    >
                      {Math.floor(this.state.currYear / 10) * 10 + idx}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default Calendar;

interface IDay {
  day: number;
  month: number;
  year: number;
  inActive: boolean;
  isToDay: boolean;
  isSelected: boolean;
}
