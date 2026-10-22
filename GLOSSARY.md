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
A Role that can do everything an Analyst can, plus delete Findings and manage Members.

**Analyst**:
A Role that can read everything in the Organization and create or edit Findings.

**Viewer**:
A Role that can only read.
_Avoid_: Guest, read-only user

**Session**:
The period during which a signed-in User is recognised without signing in again.

### Assessment work

**Project**:
A security assessment engagement run by an Organization against one target, such as a web platform or mobile app.
_Avoid_: Assessment, engagement, audit

**Member**:
A User assigned to a Project.
_Avoid_: Participant, collaborator

**Finding**:
A security issue discovered during a Project.
_Avoid_: Vulnerability, issue, bug

**Severity**:
How serious a Finding is: Critical, High, Medium, Low or Info.
_Avoid_: Priority, risk level

**Activity**:
A recorded event describing who did what to which Project or Finding, and when.
_Avoid_: Log, audit entry, event
