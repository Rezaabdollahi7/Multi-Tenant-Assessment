/**
 * Fabricated data for the Mock API.
 *
 *   pnpm --filter api seed             reset the database and seed it
 *   pnpm --filter api seed --if-empty  seed only when there is no data yet
 *
 * A fixed random seed makes every run produce the same data, so screenshots and
 * manual checks are reproducible. Dates are relative to today so the 30-day
 * trend always has data.
 */
import { config } from 'dotenv';
import { DataSource, type EntityManager } from 'typeorm';
import { Roles } from '../common/enums/role-app.enum';
import {
  ActivityActions,
  ActivityTargetTypes,
} from '../modules/activity/constants/activity.constants';
import { Activity } from '../modules/activity/entities/activity.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';
import { User } from '../modules/auth/entities/user.entity';
import { Finding } from '../modules/finding/entities/finding.entity';
import { FindingSeverity } from '../modules/finding/enums/finding-severity.enum';
import { FindingStatus } from '../modules/finding/enums/finding-status.enum';
import { Organization } from '../modules/organization/entities/organization.entity';
import { ProjectMember } from '../modules/project/entities/project-member.entity';
import { Project } from '../modules/project/entities/project.entity';
import {
  FINDING_TEMPLATES,
  ORGANIZATIONS,
  ROLES_IN_PROJECT,
  type OrganizationSeed,
} from './seed-data';

config();

const ENTITIES = [
  Organization,
  User,
  RefreshToken,
  Project,
  ProjectMember,
  Finding,
  Activity,
];
const DAY_MS = 24 * 60 * 60 * 1000;
const FINDINGS_PER_ORGANIZATION = 36;
const RANDOM_SEED = 20261017;

// Weighted so the dashboard looks like a real backlog rather than uniform noise.
const SEVERITY_WEIGHTS: [FindingSeverity, number][] = [
  [FindingSeverity.CRITICAL, 1],
  [FindingSeverity.HIGH, 3],
  [FindingSeverity.MEDIUM, 4],
  [FindingSeverity.LOW, 3],
  [FindingSeverity.INFO, 2],
];
const STATUS_WEIGHTS: [FindingStatus, number][] = [
  [FindingStatus.OPEN, 4],
  [FindingStatus.IN_REVIEW, 2],
  [FindingStatus.RESOLVED, 3],
  [FindingStatus.ACCEPTED, 1],
];

/** mulberry32: a tiny deterministic PRNG returning floats in [0, 1). */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(RANDOM_SEED);

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function pickWeighted<T>(weights: [T, number][]): T {
  const total = weights.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [value, weight] of weights) {
    roll -= weight;
    if (roll < 0) return value;
  }
  return weights[weights.length - 1][0];
}

/** A moment between `fromDaysAgo` and `toDaysAgo` days before now. */
function daysAgo(fromDaysAgo: number, toDaysAgo = 0): Date {
  const span = (fromDaysAgo - toDaysAgo) * DAY_MS;
  return new Date(
    Date.now() - toDaysAgo * DAY_MS - Math.floor(random() * span),
  );
}

function between(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + random() * (end.getTime() - start.getTime()),
  );
}

async function seedOrganization(
  manager: EntityManager,
  seed: OrganizationSeed,
): Promise<void> {
  const organization = await manager.save(
    manager.create(Organization, { name: seed.name }),
  );

  const users = await manager.save(
    seed.users.map((user) =>
      manager.create(User, { ...user, orgId: organization.id }),
    ),
  );
  const authors = users.filter((user) => user.role !== Roles.VIEWER);

  const projects = await manager.save(
    seed.projects.map((project) =>
      manager.create(Project, {
        ...project,
        orgId: organization.id,
        createdAt: daysAgo(120, 40),
      }),
    ),
  );

  await manager.save(
    projects.flatMap((project) =>
      users
        .filter(() => random() < 0.7)
        .map((user) =>
          manager.create(ProjectMember, {
            projectId: project.id,
            userId: user.id,
            roleInProject: pick(ROLES_IN_PROJECT),
            createdAt: between(project.createdAt, daysAgo(35, 30)),
          }),
        ),
    ),
  );

  const findings = Array.from({ length: FINDINGS_PER_ORGANIZATION }, () => {
    const template = pick(FINDING_TEMPLATES);
    const status = pickWeighted(STATUS_WEIGHTS);
    const createdAt = daysAgo(30);
    const updatedAt =
      status === FindingStatus.OPEN
        ? createdAt
        : between(createdAt, new Date());
    return manager.create(Finding, {
      orgId: organization.id,
      projectId: pick(projects).id,
      title: template.title,
      description: template.description,
      severity: pickWeighted(SEVERITY_WEIGHTS),
      status,
      createdById: pick(authors).id,
      createdAt,
      updatedAt,
    });
  });
  await manager.save(findings);

  await manager.save(
    findings.flatMap((finding) => {
      const created = manager.create(Activity, {
        orgId: organization.id,
        userId: finding.createdById,
        action: ActivityActions.FINDING_CREATED,
        targetType: ActivityTargetTypes.FINDING,
        targetId: finding.id,
        targetName: finding.title,
        createdAt: finding.createdAt,
      });
      if (finding.status === FindingStatus.OPEN) return [created];

      return [
        created,
        manager.create(Activity, {
          orgId: organization.id,
          userId: pick(authors).id,
          action: ActivityActions.FINDING_UPDATED,
          targetType: ActivityTargetTypes.FINDING,
          targetId: finding.id,
          targetName: finding.title,
          createdAt: finding.updatedAt,
        }),
      ];
    }),
  );

  console.log(
    `[seed] ${seed.name}: ${users.length} users, ${projects.length} projects, ${findings.length} findings`,
  );
}

async function run(): Promise<void> {
  const ifEmpty = process.argv.includes('--if-empty');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ENTITIES,
    synchronize: true,
  });
  await dataSource.initialize();

  try {
    if (ifEmpty && (await dataSource.getRepository(Organization).count()) > 0) {
      console.log('[seed] Data already present; nothing to do.');
      return;
    }

    await dataSource.transaction(async (manager) => {
      const tables = ENTITIES.map(
        (entity) => `"${dataSource.getMetadata(entity).tableName}"`,
      ).join(', ');
      await manager.query(`TRUNCATE ${tables} CASCADE`);

      for (const organization of ORGANIZATIONS) {
        await seedOrganization(manager, organization);
      }
    });
    console.log('[seed] Done.');
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('[seed] Failed:', error);
  process.exitCode = 1;
});
