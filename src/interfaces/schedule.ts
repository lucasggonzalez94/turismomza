export interface DayConfig {
  day: string;
  open24hours: boolean;
  times: Time[];
}

interface Time {
  from: string;
  to: string;
}
