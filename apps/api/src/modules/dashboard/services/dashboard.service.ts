import { countBy } from '@common/dto/breakdown.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { User } from '../../auth/entities/user.entity';
import { Finding } from '../../finding/entities/finding.entity';
import { FindingSeverity } from '../../finding/enums/finding-severity.enum';
import { Project } from '../../project/entities/project.entity';
import { ProjectStatus } from '../../project/enums/project-status.enum';
import {
  ActivityDto,
  DashboardSummaryDto,
  TrendPointDto,
} from '../dto/dashboard-response.dto';

const SEVERITIES = Object.values(FindingSeverity);
const PROJECT_STATUSES = Object.values(ProjectStatus);
const DAY_MS = 24 * 60 * 60 * 1000;

type CountRow = { key: string; count: string };

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async summary(orgId: string): Promise<DashboardSummaryDto> {
    const [severityRows, statusRows] = await Promise.all([
      this.findingRepository
        .createQueryBuilder('f')
        .select('f.severity', 'key')
        .addSelect('COUNT(*)', 'count')
        .where('f.orgId = :orgId', { orgId })
        .groupBy('f.severity')
        .getRawMany<CountRow>(),
      this.projectRepository
        .createQueryBuilder('p')
        .select('p.status', 'key')
        .addSelect('COUNT(*)', 'count')
        .where('p.orgId = :orgId', { orgId })
        .groupBy('p.status')
        .getRawMany<CountRow>(),
    ]);

    const severityBreakdown = countBy(SEVERITIES, severityRows);
    const projectStatusBreakdown = countBy(PROJECT_STATUSES, statusRows);

    return {
      projectsCount: sum(Object.values(projectStatusBreakdown)),
      findingsCount: sum(Object.values(severityBreakdown)),
      severityBreakdown,
      projectStatusBreakdown,
    };
  }

  async trend(orgId: string, days: number): Promise<TrendPointDto[]> {
    const todayStart = Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
    );
    const start = new Date(todayStart - (days - 1) * DAY_MS);

    const rows = await this.findingRepository
      .createQueryBuilder('f')
      .select(`TO_CHAR(f.createdAt AT TIME ZONE 'UTC', 'YYYY-MM-DD')`, 'date')
      .addSelect('f.severity', 'key')
      .addSelect('COUNT(*)', 'count')
      .where('f.orgId = :orgId', { orgId })
      .andWhere('f.createdAt >= :start', { start })
      .groupBy('date')
      .addGroupBy('f.severity')
      .getRawMany<CountRow & { date: string }>();

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(start.getTime() + index * DAY_MS)
        .toISOString()
        .slice(0, 10);
      const bySeverity = countBy(
        SEVERITIES,
        rows.filter((row) => row.date === date),
      );
      return { date, total: sum(Object.values(bySeverity)), bySeverity };
    });
  }

  async activities(orgId: string, limit: number): Promise<ActivityDto[]> {
    const activities = await this.activityRepository.find({
      where: { orgId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    const actors = await this.userRepository.find({
      where: { id: In(activities.map((activity) => activity.userId)) },
      select: { id: true, name: true },
    });
    const actorsById = new Map(actors.map((actor) => [actor.id, actor]));

    return activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      actor: {
        id: activity.userId,
        name: actorsById.get(activity.userId)?.name ?? null,
      },
      target: {
        type: activity.targetType,
        id: activity.targetId,
        name: activity.targetName,
      },
      createdAt: activity.createdAt,
    }));
  }
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
