import { Timestamp } from 'firebase/firestore';

export interface EmployeesType {
  id: string;
  name: string;
  nickname: string;
  password: string;
  role: string;
}

export interface ScheduleType {
  id: string;
  timestamp: Timestamp;
}
export interface WeeklyScheduleType {
  id: string;
  name: string;
  role: string;
  schedule: {
    Monday?: string;
    Tuesday?: string;
    Wednesday?: string;
    Thursday?: string;
    Friday?: string;
    Saturday?: string;
    Sunday?: string;
  };
}

export interface ScheduleDataTableRowType {
  id: string;
  name: string;
  role: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}
