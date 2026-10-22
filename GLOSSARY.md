# Secure Multi-Tenant Assessment Dashboard

A dashboard where each Organization tracks the security assessment Projects it runs and the Findings they produce. Users see only their own Organization's data, and only the operations their Role allows.

## Language

### Tenancy and access

**Organization**:
The tenant boundary: a company whose Users, Projects and Findings are isolated from every other Organization.
_Avoid_: Tenant, company, org (in UI text)

**User**:
A person who signs in with a phone number and belongs to exactly one Organization.
_Avoid_: Account, customer

**Role**:
The level of access a User holds in their Organization: Admin, Analyst or Viewer.
_Avoid_: User type, group

**Permission**:
A single allowed operation, such as reading Findings or creating one; a Role is a fixed set of Permissions.
_Avoid_: Right, scope, capability

**Admin**:
A Role that can do everything an Analyst can, plus delete Findings.

**Analyst**:
A Role that can read everything in the Organization and create or edit any of its Findings.

**Viewer**:
A Role that can only read.
_Avoid_: Guest, read-only user

**Session**:
The period during which a signed-in User is recognised without signing in again.

### Assessment work

**Project**:
A security assessment engagement run by an Organization against one target, such as a web platform or mobile app.
_Avoid_: Assessment, engagement, audit

**Project Status**:
Where a Project is in its life: Planned, In Progress, Completed or Archived.

**Member**:
A User assigned to a Project. Membership is informational: every User can see every Project in their Organization.
_Avoid_: Participant, collaborator

**Finding**:
A security issue discovered during a Project.
_Avoid_: Vulnerability, issue, bug

**Severity**:
How serious a Finding is: Critical, High, Medium, Low or Info.
_Avoid_: Priority, risk level

**Finding Status**:
Where a Finding is in its triage: Open, In Review, Resolved or Risk Accepted.

**Risk Accepted**:
A Finding Status meaning the Organization knowingly decided not to fix the Finding.
_Avoid_: Accepted, won't fix, ignored

**Activity**:
A recorded event describing who did what to which Project or Finding, and when.
_Avoid_: Log, audit entry, event
