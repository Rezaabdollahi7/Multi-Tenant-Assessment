import { setupServer } from "msw/node";

export const server = setupServer();

export const TEST_ORIGIN = "http://localhost:3000";
export const apiUrl = (path: string) => `${TEST_ORIGIN}/api${path}`;
