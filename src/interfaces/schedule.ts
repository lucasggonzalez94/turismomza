export type ISchedule = Record<string, DayConfig>;

export interface DayConfig {
  open24hours: boolean;
  times: Time[];
}

interface Time {
  from: string;
  to: string;
}
