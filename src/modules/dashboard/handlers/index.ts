import { GetAdminDashboardHandler } from './queries/GetAdminDashboard.query';
import { GetAdminProgressHandler } from './queries/GetAdminProgress.query';
import { GetStudentDashboardHandler } from './queries/GetStudentDashboard.query';
import { GetStudentReportCardHandler } from './queries/GetStudentReportCard.query';
import { GetStudentScheduleHandler } from './queries/GetStudentSchedule.query';
import { GetTeacherDashboardHandler } from './queries/GetTeacherDashboard.query';
import { GetTeacherScheduleHandler } from './queries/GetTeacherSchedule.query';

export default [
  GetStudentDashboardHandler,
  GetTeacherDashboardHandler,
  GetAdminDashboardHandler,
  GetStudentScheduleHandler,
  GetTeacherScheduleHandler,
  GetStudentReportCardHandler,
  GetAdminProgressHandler,
];
