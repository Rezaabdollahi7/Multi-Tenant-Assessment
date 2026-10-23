# Secure Multi-Tenant Assessment Dashboard

A dashboard where each Organization tracks the security assessment Projects it runs and the Findings they produce. Users see only their own Organization's data, and only the operations their Role allows.

## Language

Each term lists the word the Persian UI uses (`_Persian_`); Persian is the default UI language (ADR 0007). Code and docs use the English term.

### Tenancy and access

**Organization**:
The tenant boundary: a company whose Users, Projects and Findings are isolated from every other Organization.
_Persian_: سازمان
_Avoid_: Tenant, company, org (in UI text)

**User**:
A person who signs in with a phone number and belongs to exactly one Organization.
_Persian_: کاربر (avoid: مشتری)
_Avoid_: Account, customer

**Role**:
The level of access a User holds in their Organization: Admin, Analyst or Viewer.
_Persian_: نقش
_Avoid_: User type, group

**Permission**:
A single allowed operation, such as reading Findings or creating one; a Role is a fixed set of Permissions.
_Persian_: مجوز
_Avoid_: Right, scope, capability

**Admin**:
A Role that can do everything an Analyst can, plus delete Findings.
_Persian_: مدیر

**Analyst**:
A Role that can read everything in the Organization and create or edit any of its Findings.
_Persian_: تحلیلگر

**Viewer**:
A Role that can only read.
_Persian_: مشاهده‌گر
_Avoid_: Guest, read-only user

**Session**:
The period during which a signed-in User is recognised without signing in again.
_Persian_: نشست

### Assessment work

**Project**:
A security assessment engagement run by an Organization against one target, such as a web platform or mobile app.
_Persian_: پروژه (avoid: ممیزی)
_Avoid_: Assessment, engagement, audit

**Project Status**:
Where a Project is in its life: Planned, In Progress, Completed or Archived.
_Persian_: وضعیت پروژه: برنامه‌ریزی‌شده، در حال انجام، تکمیل‌شده، بایگانی‌شده

**Member**:
A User assigned to a Project. Membership is informational: every User can see every Project in their Organization.
_Persian_: عضو
_Avoid_: Participant, collaborator

**Finding**:
A security issue discovered during a Project.
_Persian_: یافته (avoid: آسیب‌پذیری، باگ)
_Avoid_: Vulnerability, issue, bug

**Severity**:
How serious a Finding is: Critical, High, Medium, Low or Info.
_Persian_: شدت: بحرانی، بالا، متوسط، پایین، اطلاعاتی
_Avoid_: Priority, risk level

**Finding Status**:
Where a Finding is in its triage: Open, In Review, Resolved or Risk Accepted.
_Persian_: وضعیت یافته: باز، در حال بررسی، رفع‌شده، ریسک پذیرفته‌شده

**Risk Accepted**:
A Finding Status meaning the Organization knowingly decided not to fix the Finding.
_Persian_: ریسک پذیرفته‌شده
_Avoid_: Accepted, won't fix, ignored

**Activity**:
A recorded event describing who did what to which Project or Finding, and when.
_Persian_: فعالیت
_Avoid_: Log, audit entry, event
