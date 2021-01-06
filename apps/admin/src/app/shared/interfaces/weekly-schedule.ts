export interface IDailySchedule {
  from: string;
  to: string;
}

export interface ICustomDailySchedule {
  date: string;
  from: string;
  to: string;
}

export interface IWeeklySchedule {
  mon?: IDailySchedule;
  tue?: IDailySchedule;
  wed?: IDailySchedule;
  thu?: IDailySchedule;
  fri?: IDailySchedule;
  sat?: IDailySchedule;
  sun?: IDailySchedule;
  override?: ICustomDailySchedule[];
}
