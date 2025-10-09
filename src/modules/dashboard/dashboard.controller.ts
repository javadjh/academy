import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetStudentDashboardQuery } from './handlers/queries/GetStudentDashboard.query';
import { GetTeacherDashboardQuery } from './handlers/queries/GetTeacherDashboard.query';
import { GetAdminDashboardQuery } from './handlers/queries/GetAdminDashboard.query';
import { GetTeacherScheduleQuery } from './handlers/queries/GetTeacherSchedule.query';
import { GetStudentScheduleQuery } from './handlers/queries/GetStudentSchedule.query';
import { GetStudentReportCardQuery } from './handlers/queries/GetStudentReportCard.query';
import { GetAdminProgressQuery } from './handlers/queries/GetAdminProgress.query';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Department } from 'src/decorator/department.decorator';
import { Semester } from 'src/decorator/semester.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly queryBus: QueryBus) {}

  // --- DASHBOARD ---
  @Get('student')
  @UseGuards(JwtGuard)
  async getStudentDashboard(
    @Req() req,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetStudentDashboardQuery(req.user, semester, department),
    );
  }

  @Get('teacher')
  @UseGuards(JwtGuard)
  async getTeacherDashboard(
    @Req() req,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetTeacherDashboardQuery(req.user, semester, department),
    );
  }

  @Get('admin')
  @UseGuards(JwtGuard)
  async getAdminDashboard(
    @Req() req,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetAdminDashboardQuery(req.user, semester, department),
    );
  }

  // --- SCHEDULE ---
  @Get('student/schedule')
  @UseGuards(JwtGuard)
  async getStudentSchedule(
    @Req() req,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetStudentScheduleQuery(req.user, semester, department),
    );
  }

  @Get('teacher/schedule')
  @UseGuards(JwtGuard)
  async getTeacherSchedule(
    @Req() req,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetTeacherScheduleQuery(req.user, semester, department),
    );
  }

  // --- REPORT CARD ---
  @Get('student/report-card')
  @UseGuards(JwtGuard)
  async getStudentReport(
    @Req() req,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetStudentReportCardQuery(req.user, semester, department),
    );
  }

  // --- PROGRESS (ADMIN) ---
  @Get('admin/progress')
  @UseGuards(JwtGuard)
  async getAdminProgress(
    @Req() req,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetAdminProgressQuery(req.user, semester, department),
    );
  }
}
