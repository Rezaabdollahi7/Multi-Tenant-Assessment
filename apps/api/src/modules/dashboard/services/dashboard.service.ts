import {
  DashboardSummaryDto,
  TrendPointDto,
  ActivityDto,
} from '../dto/dashboard-response.dto';
import { Project } from '../../project/entities/project.entity';
import { Finding } from '../../finding/entities/finding.entity';
import { Activity } from '../../activity/entities/activity.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const PROJECT_STATUSES = ['ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async summary(orgId: string): Promise<DashboardSummaryDto> {
    const [projectsCount, findingsCount, severityRows, statusRows] =
      await Promise.all([
        this.projectRepository
          .createQueryBuilder('p')
          .where('p.orgId = :orgId', { orgId })
          .getCount(),
        this.findingRepository
          .createQueryBuilder('f')
          .where('f.orgId = :orgId', { orgId })
          .getCount(),
        this.findingRepository
          .createQueryBuilder('f')
          .select('f.severity', 'severity')
          .addSelect('COUNT(*)', 'count')
          .where('f.orgId = :orgId', { orgId })
          .groupBy('f.severity')
          .getRawMany<{ severity: string; count: string }>(),
        this.projectRepository
          .createQueryBuilder('p')
          .select('p.status', 'status')
          .addSelect('COUNT(*)', 'count')
          .where('p.orgId = :orgId', { orgId })
          .groupBy('p.status')
          .getRawMany<{ status: string; count: string }>(),
      ]);

    const severityBreakdown = this.buildZeroMap(SEVERITIES);
    for (const row of severityRows) {
      severityBreakdown[row.severity] = Number(row.count);
    }

    const projectStatusBreakdown = this.buildZeroMap(PROJECT_STATUSES);
    for (const row of statusRows) {
      projectStatusBreakdown[row.status] = Number(row.count);
    }

    return {
      projectsCount,
      findingsCount,
      severityBreakdown,
      projectStatusBreakdown,
    };
  }

  async trend(orgId: string, days: number): Promise<TrendPointDto[]> {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const rows = await this.findingRepository
      .createQueryBuilder('f')
      .select("TO_CHAR(f.createdAt::date, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('f.orgId = :orgId', { orgId })
      .andWhere('f.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('f.createdAt::date')
      .orderBy('f.createdAt::date', 'ASC')
      .getRawMany<{ date: string; count: string }>();

    const countByDate = new Map<string, number>();
    for (const row of rows) {
      countByDate.set(row.date, Number(row.count));
    }

    const result: TrendPointDto[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = this.toDateKey(date);
      result.push({ date: key, count: countByDate.get(key) ?? 0 });
    }

    return result;
  }

  async activities(orgId: string, limit: number): Promise<ActivityDto[]> {
    const activities = await this.activityRepository.find({
      where: { orgId },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return activities.map((a) => ({
      id: a.id,
      userId: a.userId,
      action: a.action,
      targetType: a.targetType,
      targetId: a.targetId,
      targetName: a.targetName,
      createdAt: a.createdAt,
    }));
  }

  private buildZeroMap<T extends string>(
    keys: readonly T[],
  ): Record<T, number> {
    const map = {} as Record<T, number>;
    for (const key of keys) {
      map[key] = 0;
    }
    return map;
  }

  private toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
