import { ListProjectsQueryDto } from '../dto/list-projects-query.dto';
import { ProjectDetailDto, ProjectDto } from '../dto/project-response.dto';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { Finding } from '../../finding/entities/finding.entity';
import { User } from '../../auth/entities/user.entity';
import { escapeLike } from '@common/utils/escape-like.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Roles } from '@common/enums/role-app.enum';
import { In, Repository } from 'typeorm';

const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

export type MemberResponse = {
  id: string;
  userId: string;
  projectId: string;
  roleInProject: string;
  joinedAt: Date;
  name: string | null;
  phone: string;
  role: Roles;
};

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
  ): Promise<{
    items: ProjectDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

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

    const [rows, total] = await Promise.all([
      qb
        .clone()
        .orderBy('p.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
      qb.getCount(),
    ]);

    return {
      items: rows.map((p) => this.toProjectDto(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async detail(orgId: string, id: string): Promise<ProjectDetailDto> {
    const project = await this.projectRepository.findOne({
      where: { id, orgId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const counts = await this.findingRepository
      .createQueryBuilder('f')
      .select('f.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .where('f.projectId = :projectId', { projectId: id })
      .andWhere('f.orgId = :orgId', { orgId })
      .groupBy('f.severity')
      .getRawMany<{ severity: string; count: string }>();

    const severityBreakdown: Record<string, number> = {};
    for (const severity of SEVERITIES) {
      severityBreakdown[severity] = 0;
    }
    for (const row of counts) {
      severityBreakdown[row.severity] = Number(row.count);
    }

    const findingsCount = Object.values(severityBreakdown).reduce(
      (a, b) => a + b,
      0,
    );

    return {
      ...this.toProjectDto(project),
      findingsCount,
      severityBreakdown,
    };
  }

  async members(orgId: string, projectId: string): Promise<MemberResponse[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, orgId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const members = await this.memberRepository.find({
      where: { projectId },
      order: { joinedAt: 'ASC' },
    });

    if (members.length === 0) {
      return [];
    }

    const userIds = members.map((m) => m.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return members.map((m) => {
      const user = userMap.get(m.userId);
      return {
        id: m.id,
        userId: m.userId,
        projectId: m.projectId,
        roleInProject: m.roleInProject,
        joinedAt: m.joinedAt,
        name: user?.name ?? null,
        phone: user?.phone ?? '',
        role: user?.role as Roles,
      };
    });
  }

  async assertProjectInOrg(
    projectId: string,
    orgId: string,
  ): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id: projectId, orgId },
    });
  }

  private toProjectDto(project: Project): ProjectDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.createdAt,
    };
  }
}
