# Every User sees every Project in their Organization

Tenant isolation is enforced at the Organization boundary only: any User can read every Project, Finding and Activity of their own Organization, and Project membership is shown but does not restrict access. The brief requires isolation between Organizations and role-based operations; per-Project visibility would need a membership filter on every query and did not fit the delivery window.

## Consequences

Restricting Analysts and Viewers to the Projects they are Members of is listed as a known limitation and a follow-up.
