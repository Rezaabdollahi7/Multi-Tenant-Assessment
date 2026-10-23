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

/** The path usePathname returns; tests set it before rendering. */
export const navigation = { pathname: "/" };

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));
