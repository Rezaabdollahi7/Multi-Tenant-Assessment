# The NestJS backend serves as the Mock API

The brief asks for a Mock API with fabricated data, and also requires that session security is enforced on the server rather than by hiding buttons. We already had a NestJS + Postgres + Redis backend, so we use it as the Mock API and fabricate its data with a seed script. MSW is used only inside unit tests and Storybook.

## Considered Options

- **MSW or Next.js Route Handlers with in-memory data**: no Docker needed, but tenant isolation, role checks and session expiry would only be simulated, which is exactly what the brief says is not enough.

## Consequences

The evaluator needs Docker. Bringing the whole stack up must stay a single documented command.
