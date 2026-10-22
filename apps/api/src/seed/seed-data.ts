import { Roles } from '../common/enums/role-app.enum';
import { ProjectStatus } from '../modules/project/enums/project-status.enum';

export type OrganizationSeed = {
  name: string;
  users: { name: string; role: Roles; phone: string }[];
  projects: { name: string; description: string; status: ProjectStatus }[];
};

/** Three Organizations, each with one User per Role. Phones match the README. */
export const ORGANIZATIONS: OrganizationSeed[] = [
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
        description: 'Customer-facing web application and its public APIs.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'Mobile App',
        description: 'iOS and Android clients, including local storage.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'API Gateway',
        description: 'Edge gateway that routes and authenticates traffic.',
        status: ProjectStatus.COMPLETED,
      },
      {
        name: 'Legacy Portal',
        description: 'Partner portal scheduled for decommissioning.',
        status: ProjectStatus.ARCHIVED,
      },
      {
        name: 'Cloud Infrastructure',
        description: 'IAM, network and storage configuration review.',
        status: ProjectStatus.PLANNED,
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
        description: 'Batch pipeline that ingests partner data files.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'Admin Console',
        description: 'Internal tooling for support and operations.',
        status: ProjectStatus.PLANNED,
      },
      {
        name: 'Reporting Service',
        description: 'Scheduled reports and data exports.',
        status: ProjectStatus.COMPLETED,
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
        description: 'Card payments and payout integration.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'Identity Service',
        description: 'Sign-in, sessions and account recovery.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        name: 'Notifications',
        description: 'Push, SMS and email delivery.',
        status: ProjectStatus.COMPLETED,
      },
      {
        name: 'Search Index',
        description: 'Full-text search over customer records.',
        status: ProjectStatus.PLANNED,
      },
      {
        name: 'Audit Trail',
        description: 'Tamper-evident audit logging.',
        status: ProjectStatus.ARCHIVED,
      },
    ],
  },
];

export const ROLES_IN_PROJECT = [
  'Lead tester',
  'Security engineer',
  'Reviewer',
  'Developer liaison',
];

export const FINDING_TEMPLATES: { title: string; description: string }[] = [
  {
    title: 'SQL injection in search parameter',
    description:
      'The `q` parameter is concatenated into a SQL query. A crafted value returns rows from other tables.',
  },
  {
    title: 'Stored XSS in comment field',
    description:
      'Comment bodies are rendered without escaping, so a script saved by one user runs for every viewer.',
  },
  {
    title: 'Missing rate limiting on password reset',
    description:
      'The reset endpoint accepts unlimited requests, enabling SMS flooding and code guessing.',
  },
  {
    title: 'Insecure direct object reference on invoices',
    description:
      'Changing the invoice id in the URL returns invoices that belong to other customers.',
  },
  {
    title: 'Hard-coded API key in client bundle',
    description:
      'A third-party API key with write scope is shipped in the minified JavaScript bundle.',
  },
  {
    title: 'Open redirect after sign-in',
    description:
      'The `returnTo` parameter accepts absolute URLs, so a sign-in link can forward users to any site.',
  },
  {
    title: 'CSRF protection missing on profile update',
    description:
      'State-changing form posts are accepted without a token, and the session cookie is SameSite=None.',
  },
  {
    title: 'Outdated dependency with known CVE',
    description:
      'A transitive dependency is pinned to a version with a published remote code execution advisory.',
  },
  {
    title: 'Verbose errors expose stack traces',
    description:
      'Unhandled errors return the full stack trace, including internal paths and library versions.',
  },
  {
    title: 'Weak TLS configuration',
    description:
      'The load balancer still negotiates TLS 1.0 and CBC cipher suites.',
  },
  {
    title: 'Privilege escalation through role parameter',
    description:
      'The sign-up request accepts a `role` field, letting a new account register as an administrator.',
  },
  {
    title: 'Session not invalidated on logout',
    description:
      'Logging out clears the cookie in the browser but the token stays valid on the server.',
  },
  {
    title: 'Sensitive data in application logs',
    description:
      'Full card numbers appear in debug logs shipped to the central logging service.',
  },
  {
    title: 'Missing security headers',
    description:
      'Responses lack Content-Security-Policy and X-Content-Type-Options headers.',
  },
  {
    title: 'Unrestricted file upload',
    description:
      'Uploaded files are stored under the web root without type checks and can be executed.',
  },
];
