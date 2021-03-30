export interface IDateIntervalStr {
  from: string;
  to: string;
}

export interface ICustomDailySchedule {
  date: string;
  from: string;
  to: string;
}

export interface IWeeklySchedule {
  mon?: IDateIntervalStr;
  tue?: IDateIntervalStr;
  wed?: IDateIntervalStr;
  thu?: IDateIntervalStr;
  fri?: IDateIntervalStr;
  sat?: IDateIntervalStr;
  sun?: IDateIntervalStr;
  custom?: ICustomDailySchedule[];
}
