export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  pathname: "/",
  query: {},
  asPath: "/",
};

export const mockAuth = {
  user: { uid: "mocked-user", email: "test@example.com" },
  loading: false,
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
  useSearchParams: () => ({ get: jest.fn() }),
}));

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@/hooks/use-auth", () => ({
  __esModule: true,
  default: () => mockAuth,
}));
