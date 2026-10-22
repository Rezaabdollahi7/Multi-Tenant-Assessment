import { countBy } from '@common/dto/breakdown.dto';
import { paginationMeta } from '@common/dto/pagination.dto';
import { escapeLike } from '@common/utils/escape-like.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Finding } from '../../finding/entities/finding.entity';
import { FindingSeverity } from '../../finding/enums/finding-severity.enum';
import { ListProjectsQueryDto } from '../dto/list-projects-query.dto';
import {
  MemberDto,
  ProjectDetailDto,
  ProjectDto,
  ProjectListDto,
} from '../dto/project-response.dto';
import { ProjectMember } from '../entities/project-member.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepository: Repository<ProjectMember>,
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async list(
    orgId: string,
    query: ListProjectsQueryDto,
  ): Promise<ProjectListDto> {
    const qb = this.projectRepository
      .createQueryBuilder('p')
      .where('p.orgId = :orgId', { orgId });

    if (query.status) {
      qb.andWhere('p.status = :status', { status: query.status });
    }
    if (query.search) {
      qb.andWhere('p.name ILIKE :search', {
        search: `%${escapeLike(query.search)}%`,
      });
    }

    const [projects, totalItems] = await qb
      .orderBy('p.createdAt', 'DESC')
      .addOrderBy('p.id')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    const ids = projects.map((project) => project.id);
    const [findingCounts, memberCounts] = await Promise.all([
      this.countPerProject(Finding, ids),
      this.countPerProject(ProjectMember, ids),
    ]);

    return {
      data: projects.map((project) =>
        this.toDto(project, findingCounts, memberCounts),
      ),
      meta: paginationMeta(query.page, query.limit, totalItems),
    };
  }

  async detail(orgId: string, id: string): Promise<ProjectDetailDto> {
    const project = await this.findInOrg(orgId, id);

    const [severityRows, memberCounts] = await Promise.all([
      this.findingRepository
        .createQueryBuilder('f')
        .select('f.severity', 'key')
        .addSelect('COUNT(*)', 'count')
        .where('f.orgId = :orgId AND f.projectId = :id', { orgId, id })
        .groupBy('f.severity')
        .getRawMany<{ key: string; count: string }>(),
      this.countPerProject(ProjectMember, [id]),
    ]);

    const severityBreakdown = countBy(
      Object.values(FindingSeverity),
      severityRows,
    );
    const findingsCount = Object.values(severityBreakdown).reduce(
      (sum, count) => sum + count,
      0,
    );

    return {
      ...this.toDto(project, new Map([[id, findingsCount]]), memberCounts),
      severityBreakdown,
    };
  }

  async members(orgId: string, id: string): Promise<MemberDto[]> {
    await this.findInOrg(orgId, id);

    const members = await this.memberRepository.find({
      where: { projectId: id },
      order: { createdAt: 'ASC' },
    });
    const users = await this.userRepository.find({
      where: { id: In(members.map((member) => member.userId)), orgId },
    });
    const usersById = new Map(users.map((user) => [user.id, user]));

    return members.flatMap((member) => {
      const user = usersById.get(member.userId);
      if (!user) return [];
      return [
        {
          userId: user.id,
          name: user.name,
          role: user.role,
          roleInProject: member.roleInProject,
          joinedAt: member.createdAt,
        },
      ];
    });
  }

  private async findInOrg(orgId: string, id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, orgId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  private async countPerProject(
    entity: typeof Finding | typeof ProjectMember,
    projectIds: string[],
  ): Promise<Map<string, number>> {
    if (projectIds.length === 0) return new Map();

    const rows = await this.projectRepository.manager
      .createQueryBuilder(entity, 'row')
      .select('row.projectId', 'projectId')
      .addSelect('COUNT(*)', 'count')
      .where('row.projectId IN (:...projectIds)', { projectIds })
      .groupBy('row.projectId')
      .getRawMany<{ projectId: string; count: string }>();

    return new Map(rows.map((row) => [row.projectId, Number(row.count)]));
  }

  private toDto(
    project: Project,
    findingCounts: Map<string, number>,
    memberCounts: Map<string, number>,
  ): ProjectDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      findingsCount: findingCounts.get(project.id) ?? 0,
      membersCount: memberCounts.get(project.id) ?? 0,
      createdAt: project.createdAt,
    };
  }
}
