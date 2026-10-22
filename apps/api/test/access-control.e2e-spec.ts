import {
  createOrganization,
  createTestApp,
  removeOrganizations,
  signIn,
  type OrganizationFixture,
  type TestApp,
} from './support/test-app';

describe('Permissions and tenant isolation (e2e)', () => {
  let testApp: TestApp;
  let orgA: OrganizationFixture;
  let orgB: OrganizationFixture;
  const sessions: Record<string, string[]> = {};

  beforeAll(async () => {
    testApp = await createTestApp();
    orgA = await createOrganization(testApp.dataSource, 'org-a');
    orgB = await createOrganization(testApp.dataSource, 'org-b');

    sessions.adminA = await signIn(testApp, orgA.users.admin);
    sessions.analystA = await signIn(testApp, orgA.users.analyst);
    sessions.viewerA = await signIn(testApp, orgA.users.viewer);
    sessions.adminB = await signIn(testApp, orgB.users.admin);
  });

  afterAll(async () => {
    await removeOrganizations(testApp.dataSource, [orgA, orgB]);
    await testApp.close();
  });

  const newFinding = () => ({
    projectId: orgA.project.id,
    title: 'Reflected XSS in search',
    severity: 'MEDIUM',
  });

  describe('Permissions by Role', () => {
    it('forbids a Viewer from creating a Finding', async () => {
      await testApp
        .http()
        .post('/api/findings')
        .set('Cookie', sessions.viewerA)
        .send(newFinding())
        .expect(403);
    });

    it('lets an Analyst create and edit a Finding, and records Activities', async () => {
      const created = await testApp
        .http()
        .post('/api/findings')
        .set('Cookie', sessions.analystA)
        .send(newFinding())
        .expect(201);
      const findingId = (created.body as { id: string }).id;

      expect(created.body).toMatchObject({
        status: 'OPEN',
        project: { id: orgA.project.id, name: orgA.project.name },
        createdBy: { id: orgA.users.analyst.id },
      });

      await testApp
        .http()
        .patch(`/api/findings/${findingId}`)
        .set('Cookie', sessions.analystA)
        .send({ status: 'IN_REVIEW' })
        .expect(200);

      const activities = await testApp
        .http()
        .get('/api/dashboard/activities')
        .set('Cookie', sessions.viewerA)
        .expect(200);
      const forFinding = (
        activities.body as { action: string; target: { id: string } }[]
      )
        .filter((activity) => activity.target.id === findingId)
        .map((activity) => activity.action);
      expect(forFinding).toEqual(['finding.updated', 'finding.created']);
    });

    it('forbids an Analyst from deleting a Finding but lets an Admin', async () => {
      const path = `/api/findings/${orgA.finding.id}`;
      await testApp
        .http()
        .delete(path)
        .set('Cookie', sessions.analystA)
        .expect(403);
      await testApp
        .http()
        .delete(path)
        .set('Cookie', sessions.adminA)
        .expect(204);
      await testApp.http().get(path).set('Cookie', sessions.adminA).expect(404);
    });

    it('returns field-level validation errors', async () => {
      const response = await testApp
        .http()
        .post('/api/findings')
        .set('Cookie', sessions.analystA)
        .send({ ...newFinding(), title: 'ab', severity: 'URGENT' })
        .expect(400);

      expect(response.body).toMatchObject({
        message: 'Validation failed',
        errors: {
          title: ['title must be at least 3 characters'],
          severity: ['severity must be a valid value'],
        },
      });
    });
  });

  describe('Tenant isolation', () => {
    it("hides another Organization's Project as not found", async () => {
      await testApp
        .http()
        .get(`/api/projects/${orgA.project.id}`)
        .set('Cookie', sessions.adminB)
        .expect(404);
      await testApp
        .http()
        .get(`/api/projects/${orgA.project.id}/members`)
        .set('Cookie', sessions.adminB)
        .expect(404);
    });

    it("cannot read, edit or delete another Organization's Finding", async () => {
      const path = `/api/findings/${orgB.finding.id}`;
      await testApp.http().get(path).set('Cookie', sessions.adminA).expect(404);
      await testApp
        .http()
        .patch(path)
        .set('Cookie', sessions.adminA)
        .send({ title: 'Taken over' })
        .expect(404);
      await testApp
        .http()
        .delete(path)
        .set('Cookie', sessions.adminA)
        .expect(404);
    });

    it("cannot file a Finding under another Organization's Project", async () => {
      await testApp
        .http()
        .post('/api/findings')
        .set('Cookie', sessions.adminB)
        .send(newFinding())
        .expect(404);
    });

    it('lists only the caller’s own Projects and Findings', async () => {
      const projects = await testApp
        .http()
        .get('/api/projects')
        .set('Cookie', sessions.adminB)
        .expect(200);
      expect(projects.body).toEqual({
        data: [expect.objectContaining({ id: orgB.project.id })],
        meta: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
      });

      const findings = await testApp
        .http()
        .get('/api/findings')
        .set('Cookie', sessions.adminB)
        .expect(200);
      const ids = (findings.body as { data: { id: string }[] }).data.map(
        (finding) => finding.id,
      );
      expect(ids).toEqual([orgB.finding.id]);
    });

    it('rejects an orgId smuggled into the request body', async () => {
      await testApp
        .http()
        .post('/api/findings')
        .set('Cookie', sessions.adminB)
        .send({ ...newFinding(), orgId: orgA.organization.id })
        .expect(400);
    });
  });
});
