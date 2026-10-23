import { Roles } from '@common/enums/role-app.enum';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomInt } from 'node:crypto';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { Activity } from '../../src/modules/activity/entities/activity.entity';
import { RefreshToken } from '../../src/modules/auth/entities/refresh-token.entity';
import { User } from '../../src/modules/auth/entities/user.entity';
import { Finding } from '../../src/modules/finding/entities/finding.entity';
import { FindingSeverity } from '../../src/modules/finding/enums/finding-severity.enum';
import { Organization } from '../../src/modules/organization/entities/organization.entity';
import { ProjectMember } from '../../src/modules/project/entities/project-member.entity';
import { Project } from '../../src/modules/project/entities/project.entity';

export const DEV_OTP = process.env.DEV_OTP ?? '00000';

export type TestApp = {
  app: INestApplication<App>;
  dataSource: DataSource;
  http: () => ReturnType<typeof request>;
  close: () => Promise<void>;
};

export async function createTestApp(): Promise<TestApp> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>();
  configureApp(app);
  await app.init();

  return {
    app,
    dataSource: app.get(DataSource),
    http: () => request(app.getHttpServer()),
    close: () => app.close(),
  };
}

function uniquePhone(): string {
  return `0912${randomInt(0, 10_000_000).toString().padStart(7, '0')}`;
}

export type OrganizationFixture = {
  organization: Organization;
  users: Record<'admin' | 'analyst' | 'viewer', User>;
  project: Project;
  finding: Finding;
};

export async function createOrganization(
  dataSource: DataSource,
  label: string,
): Promise<OrganizationFixture> {
  const manager = dataSource.manager;
  const organization = await manager.save(
    manager.create(Organization, {
      name: `e2e ${label} ${randomInt(0, 1_000_000_000)}`,
    }),
  );

  const [admin, analyst, viewer] = await manager.save(
    [Roles.ADMIN, Roles.ANALYST, Roles.VIEWER].map((role) =>
      manager.create(User, {
        name: `${label} ${role.toLowerCase()}`,
        role,
        phone: uniquePhone(),
        orgId: organization.id,
      }),
    ),
  );

  const project = await manager.save(
    manager.create(Project, {
      orgId: organization.id,
      name: `${label} project`,
      description: null,
    }),
  );
  await manager.save(
    manager.create(ProjectMember, {
      projectId: project.id,
      userId: analyst.id,
      roleInProject: 'Lead tester',
    }),
  );

  const finding = await manager.save(
    manager.create(Finding, {
      orgId: organization.id,
      projectId: project.id,
      title: `${label} finding`,
      description: null,
      severity: FindingSeverity.HIGH,
      createdById: analyst.id,
    }),
  );

  return {
    organization,
    users: { admin, analyst, viewer },
    project,
    finding,
  };
}

export async function removeOrganizations(
  dataSource: DataSource,
  fixtures: OrganizationFixture[],
): Promise<void> {
  const orgIds = fixtures.map((fixture) => fixture.organization.id);
  const userIds = fixtures.flatMap((fixture) =>
    Object.values(fixture.users).map((user) => user.id),
  );
  const projectIds = fixtures.map((fixture) => fixture.project.id);

  await dataSource.transaction(async (manager) => {
    await manager.delete(Activity, { orgId: In(orgIds) });
    await manager.delete(Finding, { orgId: In(orgIds) });
    await manager.delete(ProjectMember, { projectId: In(projectIds) });
    await manager.delete(Project, { orgId: In(orgIds) });
    await manager.delete(RefreshToken, { userId: In(userIds) });
    await manager.delete(User, { id: In(userIds) });
    await manager.delete(Organization, { id: In(orgIds) });
  });
}

export function cookiesFrom(response: request.Response): string[] {
  const header = response.headers['set-cookie'] as
    string[] | string | undefined;
  const cookies = Array.isArray(header) ? header : header ? [header] : [];
  return cookies
    .map((cookie) => cookie.split(';')[0])
    .filter((pair) => !pair.endsWith('='));
}

export async function signIn(testApp: TestApp, user: User): Promise<string[]> {
  await testApp
    .http()
    .post('/api/auth/request-otp')
    .send({ phone: user.phone })
    .expect(200);

  const response = await testApp
    .http()
    .post('/api/auth/verify-otp')
    .send({ phone: user.phone, code: DEV_OTP })
    .expect(200);

  return cookiesFrom(response);
}
