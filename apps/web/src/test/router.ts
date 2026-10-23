import { vi } from "vitest";

/** A stand-in for next/navigation's router; assert on its calls. */
export const router = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

/** What usePathname and useSearchParams return; tests set them before rendering. */
export const navigation = { pathname: "/", search: "" };

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
  redirect: vi.fn(),
}));
