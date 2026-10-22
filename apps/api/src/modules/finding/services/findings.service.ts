import { ListFindingsQueryDto } from '../dto/list-findings-query.dto';
import { CreateFindingDto } from '../dto/create-finding.dto';
import { UpdateFindingDto } from '../dto/update-finding.dto';
import { FindingDto } from '../dto/finding-response.dto';
import { Finding } from '../entities/finding.entity';
import { FindingStatus } from '../enums/finding-status.enum';
import { Project } from '../../project/entities/project.entity';
import { ActivityService } from '../../activity/services/activity.service';
import {
  ActivityActions,
  ActivityTargetTypes,
} from '../../activity/constants/activity.constants';
import { escapeLike } from '@common/utils/escape-like.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FindingsService {
  constructor(
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly activityService: ActivityService,
    private readonly dataSource: DataSource,
  ) {}

  async list(
    orgId: string,
    query: ListFindingsQueryDto,
  ): Promise<{
    items: FindingDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.findingRepository
      .createQueryBuilder('f')
      .where('f.orgId = :orgId', { orgId });

    if (query.projectId) {
      qb.andWhere('f.projectId = :projectId', { projectId: query.projectId });
    }
    if (query.severity) {
      qb.andWhere('f.severity = :severity', { severity: query.severity });
    }
    if (query.status) {
      qb.andWhere('f.status = :status', { status: query.status });
    }
    if (query.search) {
      qb.andWhere('f.title ILIKE :search', {
        search: `%${escapeLike(query.search)}%`,
      });
    }

    const [rows, total] = await Promise.all([
      qb
        .clone()
        .orderBy('f.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
      qb.getCount(),
    ]);

    return {
      items: rows.map((f) => this.toDto(f)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async detail(orgId: string, id: string): Promise<FindingDto> {
    const finding = await this.findingRepository.findOne({
      where: { id, orgId },
    });
    if (!finding) {
      throw new NotFoundException('Finding not found');
    }
    return this.toDto(finding);
  }

  async create(
    orgId: string,
    userId: string,
    dto: CreateFindingDto,
  ): Promise<FindingDto> {
    // Verify the referenced project belongs to the caller's organization.
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId, orgId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.dataSource.transaction(async (manager) => {
      const finding = manager.create(Finding, {
        projectId: dto.projectId,
        orgId,
        title: dto.title,
        description: dto.description,
        severity: dto.severity,
        status: FindingStatus.OPEN,
        createdById: userId,
      });
      const saved = await manager.save(finding);

      await this.activityService.record(
        {
          orgId,
          userId,
          action: ActivityActions.FINDING_CREATED,
          targetType: ActivityTargetTypes.FINDING,
          targetId: saved.id,
          targetName: saved.title,
        },
        manager,
      );

      return this.toDto(saved);
    });
  }

  async update(
    orgId: string,
    userId: string,
    id: string,
    dto: UpdateFindingDto,
  ): Promise<FindingDto> {
    const { title, description, severity, status } = dto;
    if (
      title === undefined &&
      description === undefined &&
      severity === undefined &&
      status === undefined
    ) {
      throw new BadRequestException('At least one field must be provided');
    }

    return this.dataSource.transaction(async (manager) => {
      const finding = await manager.findOne(Finding, {
        where: { id, orgId },
      });
      if (!finding) {
        throw new NotFoundException('Finding not found');
      }

      if (title !== undefined) finding.title = title;
      if (description !== undefined) finding.description = description;
      if (severity !== undefined) finding.severity = severity;
      if (status !== undefined) finding.status = status;

      const saved = await manager.save(finding);

      await this.activityService.record(
        {
          orgId,
          userId,
          action: ActivityActions.FINDING_UPDATED,
          targetType: ActivityTargetTypes.FINDING,
          targetId: saved.id,
          targetName: saved.title,
        },
        manager,
      );

      return this.toDto(saved);
    });
  }

  async remove(
    orgId: string,
    userId: string,
    id: string,
  ): Promise<{ success: boolean }> {
    return this.dataSource.transaction(async (manager) => {
      const finding = await manager.findOne(Finding, {
        where: { id, orgId },
      });
      if (!finding) {
        throw new NotFoundException('Finding not found');
      }

      await manager.delete(Finding, { id, orgId });

      await this.activityService.record(
        {
          orgId,
          userId,
          action: ActivityActions.FINDING_DELETED,
          targetType: ActivityTargetTypes.FINDING,
          targetId: id,
          targetName: finding.title,
        },
        manager,
      );

      return { success: true };
    });
  }

  private toDto(finding: Finding): FindingDto {
    return {
      id: finding.id,
      projectId: finding.projectId,
      title: finding.title,
      description: finding.description,
      severity: finding.severity,
      status: finding.status,
      createdById: finding.createdById,
      createdAt: finding.createdAt,
      updatedAt: finding.updatedAt,
    };
  }
}
