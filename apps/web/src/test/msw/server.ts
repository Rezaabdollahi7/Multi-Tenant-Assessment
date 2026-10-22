import { setupServer } from "msw/node";

/** Tests register their own handlers with `server.use(...)`. */
export const server = setupServer();

/** The origin jsdom runs on; API calls in tests resolve against it. */
export const TEST_ORIGIN = "http://localhost:3000";
export const apiUrl = (path: string) => `${TEST_ORIGIN}/api${path}`;
