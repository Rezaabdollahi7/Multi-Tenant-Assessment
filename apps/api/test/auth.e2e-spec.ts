import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@common/constants/jwt.constants';
import {
  cookiesFrom,
  createOrganization,
  createTestApp,
  DEV_OTP,
  removeOrganizations,
  signIn,
  type OrganizationFixture,
  type TestApp,
} from './support/test-app';

describe('Authentication and Session (e2e)', () => {
  let testApp: TestApp;
  let org: OrganizationFixture;

  beforeAll(async () => {
    testApp = await createTestApp();
    org = await createOrganization(testApp.dataSource, 'auth');
  });

  afterAll(async () => {
    await removeOrganizations(testApp.dataSource, [org]);
    await testApp.close();
  });

  const refreshCookie = (cookies: string[]) =>
    cookies.filter((cookie) => cookie.startsWith(`${REFRESH_TOKEN_COOKIE}=`));

  it('rejects a wrong code and says how many attempts remain', async () => {
    const { phone } = org.users.viewer;
    await testApp
      .http()
      .post('/api/auth/request-otp')
      .send({ phone })
      .expect(200);

    const response = await testApp
      .http()
      .post('/api/auth/verify-otp')
      .send({ phone, code: '99999' })
      .expect(401);

    expect(response.body).toMatchObject({
      statusCode: 401,
      message: 'Invalid code. 4 attempts remaining.',
    });
  });

  it('sets httpOnly session cookies scoped to the right paths', async () => {
    const { phone } = org.users.admin;
    await testApp
      .http()
      .post('/api/auth/request-otp')
      .send({ phone })
      .expect(200);

    const response = await testApp
      .http()
      .post('/api/auth/verify-otp')
      .send({ phone, code: DEV_OTP })
      .expect(200);

    const setCookie = response.headers['set-cookie'] as unknown as string[];
    const access = setCookie.find((c) => c.startsWith(ACCESS_TOKEN_COOKIE));
    const refresh = setCookie.find((c) => c.startsWith(REFRESH_TOKEN_COOKIE));
    expect(access).toMatch(/Path=\/;.*HttpOnly; SameSite=Lax/);
    expect(refresh).toMatch(/Path=\/;.*HttpOnly; SameSite=Lax/);
  });

  it('returns the signed-in User with the Permissions of their Role', async () => {
    const cookies = await signIn(testApp, org.users.analyst);

    const response = await testApp
      .http()
      .get('/api/auth/me')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body).toMatchObject({
      id: org.users.analyst.id,
      role: 'ANALYST',
      organization: { id: org.organization.id },
    });
    expect(response.body).not.toHaveProperty('orgId');
    expect((response.body as { permissions: string[] }).permissions).toEqual(
      expect.arrayContaining(['finding:create', 'finding:update']),
    );
    expect(
      (response.body as { permissions: string[] }).permissions,
    ).not.toContain('finding:delete');
  });

  it('rejects requests without a session', async () => {
    await testApp.http().get('/api/auth/me').expect(401);
  });

  it('rotates the refresh token and revokes the family when an old one is reused', async () => {
    const original = await signIn(testApp, org.users.admin);

    const rotated = cookiesFrom(
      await testApp
        .http()
        .post('/api/auth/refresh')
        .set('Cookie', refreshCookie(original))
        .expect(200),
    );
    expect(refreshCookie(rotated)).not.toEqual(refreshCookie(original));

    await testApp
      .http()
      .post('/api/auth/refresh')
      .set('Cookie', refreshCookie(original))
      .expect(401);
    await testApp
      .http()
      .post('/api/auth/refresh')
      .set('Cookie', refreshCookie(rotated))
      .expect(401);
  });

  it('revokes the refresh token on logout', async () => {
    const cookies = await signIn(testApp, org.users.viewer);

    await testApp
      .http()
      .post('/api/auth/logout')
      .set('Cookie', cookies)
      .expect(200);

    await testApp
      .http()
      .post('/api/auth/refresh')
      .set('Cookie', refreshCookie(cookies))
      .expect(401);
  });
});
