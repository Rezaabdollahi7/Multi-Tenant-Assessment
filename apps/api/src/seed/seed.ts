import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { randomUUID } from 'node:crypto';

import { Organization } from '../modules/organization/entities/organization.entity';
import { User } from '../modules/auth/entities/user.entity';
import { Project } from '../modules/project/entities/project.entity';
import { ProjectMember } from '../modules/project/entities/project-member.entity';
import { Finding } from '../modules/finding/entities/finding.entity';
import { Activity } from '../modules/activity/entities/activity.entity';
import { Roles } from '../common/enums/role-app.enum';
import { ProjectStatus } from '../modules/project/enums/project-status.enum';
import { FindingSeverity } from '../modules/finding/enums/finding-severity.enum';
import { FindingStatus } from '../modules/finding/enums/finding-status.enum';
import {
  ActivityActions,
  ActivityTargetTypes,
} from '../modules/activity/constants/activity.constants';

config();

const SEVERITIES = Object.values(FindingSeverity);
const STATUSES = Object.values(FindingStatus);

type OrgSeed = {
  name: string;
  users: { name: string; role: Roles; phone: string }[];
  projects: { name: string; description: string; status: ProjectStatus }[];
};

const ORGS: OrgSeed[] = [
  {
    name: 'Org A',
    users: [
      { name: 'Ali Ahmadi', role: Roles.ADMIN, phone: '09911110001' },
      { name: 'Sara Mohammadi', role: Roles.ANALYST, phone: '09911110002' },
      { name: 'Reza Karimi', role: Roles.VIEWER, phone: '09911110003' },
    ],
    projects: [
      {
        name: 'Web Platform',
        description: 'Primary web application',
        status: ProjectStatus.ACTIVE,
      },
      {
        name: 'Mobile App',
        description: 'iOS and Android clients',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'API Gateway',
        description: 'Backend services gateway',
        status: ProjectStatus.COMPLETED,
      },
      {
        name: 'Legacy Portal',
        description: 'Legacy portal being decommissioned',
        status: ProjectStatus.ARCHIVED,
      },
    ],
  },
  {
    name: 'Org B',
    users: [
      { name: 'Maryam Hosseini', role: Roles.ADMIN, phone: '09922220001' },
      { name: 'Hossein Rezaei', role: Roles.ANALYST, phone: '09922220002' },
      { name: 'Zahra Naderi', role: Roles.VIEWER, phone: '09922220003' },
    ],
    projects: [
      {
        name: 'Payload Processor',
        description: 'Data processing pipeline',
        status: ProjectStatus.ACTIVE,
      },
      {
        name: 'Admin Console',
        description: 'Internal admin tooling',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'Reporting Service',
        description: 'Reporting and analytics',
        status: ProjectStatus.ACTIVE,
      },
    ],
  },
  {
    name: 'Org C',
    users: [
      { name: 'Amir Taheri', role: Roles.ADMIN, phone: '09933330001' },
      { name: 'Neda Safari', role: Roles.ANALYST, phone: '09933330002' },
      { name: 'Kaveh Moradi', role: Roles.VIEWER, phone: '09933330003' },
    ],
    projects: [
      {
        name: 'Payments',
        description: 'Payment integration',
        status: ProjectStatus.ACTIVE,
      },
      {
        name: 'Identity Service',
        description: 'Authentication and identity',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'Notifications',
        description: 'Push and email notifications',
        status: ProjectStatus.COMPLETED,
      },
      {
        name: 'Search Index',
        description: 'Full-text search indexing',
        status: ProjectStatus.ACTIVE,
      },
      {
        name: 'Audit Trail',
        description: 'Audit logging service',
        status: ProjectStatus.IN_PROGRESS,
      },
    ],
  },
];

const FINDING_TITLES = [
  'SQL injection in login form',
  'Stored XSS in comment field',
  'Missing rate limiting on endpoint',
  'Weak password policy',
  'Sensitive data in error messages',
  'Insecure direct object reference',
  'Hardcoded API key in source',
  'Unvalidated redirect after login',
  'CSRF token not enforced',
  'Outdated dependency with known CVE',
  'Debug mode enabled in production',
  'Insufficient access controls',
];

const TITLES_IN_PROJECT = [
  'Cross-tenant data leak',
  'Broken authentication flow',
  'Privilege escalation via role confusion',
  'Unencrypted storage of secrets',
  'Missing audit logging',
  'Improper input validation',
  'Session fixation vulnerability',
  'Information disclosure in headers',
  'Denial of service via large payload',
  'Open redirect vulnerability',
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateInLastDays(days: number): Date {
  const now = Date.now();
  const offset = Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [Organization, User, Project, ProjectMember, Finding, Activity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  const orgRepo = dataSource.getRepository(Organization);
  const userRepo = dataSource.getRepository(User);
  const projectRepo = dataSource.getRepository(Project);
  const memberRepo = dataSource.getRepository(ProjectMember);

  for (const orgSeed of ORGS) {
    let org = await orgRepo.findOne({ where: { name: orgSeed.name } });
    const isNewOrg = !org;

    if (org && !isNewOrg) {
      const existingUsers = await userRepo.count({
        where: { orgId: org.id },
      });
      if (existingUsers > 0) {
        console.log(`[seed] ${orgSeed.name} already seeded, skipping.`);
        continue;
      }
    }

    if (!org) {
      org = await orgRepo.save(orgRepo.create({ name: orgSeed.name }));
    }

    // Users
    const users: User[] = [];
    for (const userSeed of orgSeed.users) {
      let user = await userRepo.findOne({
        where: { phone: userSeed.phone },
      });
      if (!user) {
        user = await userRepo.save(
          userRepo.create({
            name: userSeed.name,
            role: userSeed.role,
            phone: userSeed.phone,
            orgId: org.id,
          }),
        );
      } else {
        // Ensure the user is attached to the org/role correctly.
        user.orgId = org.id;
        user.role = userSeed.role;
        user.name = userSeed.name;
        await userRepo.save(user);
      }
      users.push(user);
    }

    // Projects
    const projects: Project[] = [];
    for (const projectSeed of orgSeed.projects) {
      const existing = await projectRepo.findOne({
        where: { orgId: org.id, name: projectSeed.name },
      });
      if (existing) {
        projects.push(existing);
        continue;
      }
      const project = await projectRepo.save(
        projectRepo.create({
          orgId: org.id,
          name: projectSeed.name,
          description: projectSeed.description,
          status: projectSeed.status,
        }),
      );
      projects.push(project);
    }

    // Members: assign subset of users to each project (same org enforced by user list)
    for (const project of projects) {
      const memberCount = 1 + Math.floor(Math.random() * users.length);
      const shuffled = [...users].sort(() => Math.random() - 0.5);
      for (const user of shuffled.slice(0, memberCount)) {
        const existing = await memberRepo.findOne({
          where: { projectId: project.id, userId: user.id },
        });
        if (existing) continue;
        await memberRepo.save(
          memberRepo.create({
            projectId: project.id,
            userId: user.id,
            roleInProject: pick([
              'Developer',
              'Security Engineer',
              'Reviewer',
              'Tech Lead',
            ]),
            joinedAt: randomDateInLastDays(30),
          }),
        );
      }
    }

    // Findings: a few dozen spread over last 30 days
    const admin = users.find((u) => u.role === Roles.ADMIN) ?? users[0];
    const findingsCount = 30 + Math.floor(Math.random() * 12);
    const findingRows: Record<string, unknown>[] = [];

    for (let i = 0; i < findingsCount; i++) {
      const project = pick(projects);
      const createdAt = randomDateInLastDays(30);
      const title =
        i % 4 === 0 ? pick(FINDING_TITLES) : `${pick(TITLES_IN_PROJECT)}`;
      findingRows.push({
        id: randomUUID(),
        projectId: project.id,
        orgId: org.id,
        title,
        description: `Auto-generated finding for ${project.name}.`,
        severity: pick(SEVERITIES),
        status: pick(STATUSES),
        createdById: admin.id,
        createdAt,
        updatedAt: createdAt,
      });
    }

    // Bulk insert findings (explicit createdAt preserved)
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Finding)
      .values(findingRows)
      .execute();

    // Activities
    const activityRows: Record<string, unknown>[] = [];
    const createdFindings = await dataSource.getRepository(Finding).find({
      where: { orgId: org.id },
      order: { createdAt: 'ASC' },
      take: 15,
    });
    for (const f of createdFindings) {
      activityRows.push({
        id: randomUUID(),
        orgId: org.id,
        userId: admin.id,
        action: ActivityActions.FINDING_CREATED,
        targetType: ActivityTargetTypes.FINDING,
        targetId: f.id,
        targetName: f.title,
        createdAt: f.createdAt,
        updatedAt: f.createdAt,
      });
    }
    if (activityRows.length > 0) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Activity)
        .values(activityRows)
        .execute();
    }

    console.log(
      `[seed] ${org.name}: ${users.length} users, ${projects.length} projects, ${findingsCount} findings`,
    );
  }

  await dataSource.destroy();
  console.log('[seed] Done.');
}

seed().catch((error) => {
  console.error('[seed] Failed:', error);
  process.exitCode = 1;
});
