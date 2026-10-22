import { paginationMeta } from '@common/dto/pagination.dto';
import { escapeLike } from '@common/utils/escape-like.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import {
  ActivityActions,
  ActivityTargetTypes,
} from '../../activity/constants/activity.constants';
import { ActivityService } from '../../activity/services/activity.service';
import { User } from '../../auth/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { CreateFindingDto } from '../dto/create-finding.dto';
import { FindingDto, FindingListDto } from '../dto/finding-response.dto';
import { ListFindingsQueryDto } from '../dto/list-findings-query.dto';
import { UpdateFindingDto } from '../dto/update-finding.dto';
import { Finding } from '../entities/finding.entity';
import { FindingStatus } from '../enums/finding-status.enum';

@Injectable()
export class FindingsService {
  constructor(
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly activityService: ActivityService,
    private readonly dataSource: DataSource,
  ) {}

  async list(
    orgId: string,
    query: ListFindingsQueryDto,
  ): Promise<FindingListDto> {
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

    const [findings, totalItems] = await qb
      .orderBy('f.createdAt', 'DESC')
      .addOrderBy('f.id')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return {
      data: await this.toDtos(findings),
      meta: paginationMeta(query.page, query.limit, totalItems),
    };
  }

  async detail(orgId: string, id: string): Promise<FindingDto> {
    const finding = await this.findInOrg(this.dataSource.manager, orgId, id);
    const [dto] = await this.toDtos([finding]);
    return dto;
  }

  async create(
    orgId: string,
    userId: string,
    dto: CreateFindingDto,
  ): Promise<FindingDto> {
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId, orgId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const finding = await this.dataSource.transaction(async (manager) => {
      const saved = await manager.save(
        manager.create(Finding, {
          orgId,
          projectId: project.id,
          title: dto.title,
          description: dto.description || null,
          severity: dto.severity,
          status: FindingStatus.OPEN,
          createdById: userId,
        }),
      );
      await this.activityService.record(manager, {
        orgId,
        userId,
        action: ActivityActions.FINDING_CREATED,
        targetType: ActivityTargetTypes.FINDING,
        targetId: saved.id,
        targetName: saved.title,
      });
      return saved;
    });

    return this.detail(orgId, finding.id);
  }

  async update(
    orgId: string,
    userId: string,
    id: string,
    dto: UpdateFindingDto,
  ): Promise<FindingDto> {
    const { title, description, severity, status } = dto;
    if ([title, description, severity, status].every((v) => v === undefined)) {
      throw new BadRequestException('At least one field must be provided');
    }

    await this.dataSource.transaction(async (manager) => {
      const finding = await this.findInOrg(manager, orgId, id);

      if (title !== undefined) finding.title = title;
      if (description !== undefined) finding.description = description || null;
      if (severity !== undefined) finding.severity = severity;
      if (status !== undefined) finding.status = status;

      await manager.save(finding);
      await this.activityService.record(manager, {
        orgId,
        userId,
        action: ActivityActions.FINDING_UPDATED,
        targetType: ActivityTargetTypes.FINDING,
        targetId: finding.id,
        targetName: finding.title,
      });
    });

    return this.detail(orgId, id);
  }

  async remove(orgId: string, userId: string, id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const finding = await this.findInOrg(manager, orgId, id);

      await manager.delete(Finding, { id: finding.id, orgId });
      await this.activityService.record(manager, {
        orgId,
        userId,
        action: ActivityActions.FINDING_DELETED,
        targetType: ActivityTargetTypes.FINDING,
        targetId: finding.id,
        targetName: finding.title,
      });
    });
  }

  private async findInOrg(
    manager: EntityManager,
    orgId: string,
    id: string,
  ): Promise<Finding> {
    const finding = await manager.findOne(Finding, { where: { id, orgId } });
    if (!finding) {
      throw new NotFoundException('Finding not found');
    }
    return finding;
  }

  /** Resolves Project and author names in two queries for the whole page. */
  private async toDtos(findings: Finding[]): Promise<FindingDto[]> {
    if (findings.length === 0) return [];

    const [projects, authors] = await Promise.all([
      this.projectRepository.find({
        where: { id: In(findings.map((f) => f.projectId)) },
        select: { id: true, name: true },
      }),
      this.userRepository.find({
        where: { id: In(findings.map((f) => f.createdById)) },
        select: { id: true, name: true },
      }),
    ]);
    const projectsById = new Map(projects.map((p) => [p.id, p]));
    const authorsById = new Map(authors.map((u) => [u.id, u]));

    return findings.map((finding) => ({
      id: finding.id,
      title: finding.title,
      description: finding.description,
      severity: finding.severity,
      status: finding.status,
      project: {
        id: finding.projectId,
        name: projectsById.get(finding.projectId)?.name ?? '',
      },
      createdBy: {
        id: finding.createdById,
        name: authorsById.get(finding.createdById)?.name ?? null,
      },
      createdAt: finding.createdAt,
      updatedAt: finding.updatedAt,
    }));
  }
}
