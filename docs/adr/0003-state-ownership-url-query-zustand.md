# State lives in the URL, TanStack Query, or Zustand, by kind

Each kind of state has one owner. Search, filters and pagination live in the URL so views are shareable and the back button works. Everything that comes from the API is owned by TanStack Query, which handles caching, refetching and loading and error states. Zustand holds only client-only UI state, such as whether the sidebar is open.

## Considered Options

- **Zustand for everything**: we would have to rebuild caching, deduplication and invalidation by hand, and server data would drift from the API.
- **React Context instead of Zustand**: fine for the little client state we have, but every consumer re-renders on each change; Zustand's selectors avoid that at no extra cost.
