# No client state library: UI state stays with the component that owns it

> **Update:** the redesign replaced the sidebar with a top navigation bar that holds no state. The decision stands.

ADR 0003 gave client-only UI state to Zustand. With the app built, none is left for it: the sidebar's open state belongs to the shadcn `SidebarProvider` and is stored in a cookie, so the server renders it correctly with no flash; the theme belongs to `next-themes`; the signed-in User comes from the server through `SessionProvider`; and search, filters and pagination are in the URL. The remaining state (an open dialog, a form's draft) is local to one component. So Zustand is removed; ADR 0003 stands for the URL and TanStack Query, and this record replaces its Zustand part.

## Considered Options

- **Keep Zustand for future UI state**: a dependency and a pattern with no user, which reviewers would rightly flag as dead code. It can be added back the day two distant components share client-only state.
- **Move the sidebar into a Zustand store**: the cookie is what lets the server render the sidebar in the right state; a client store would need the cookie anyway and would add a second owner.

## Consequences

The brief asks for "Zustand or an equivalent, with a stated reason": this record is that reason. React context covers the two app-wide values (session and theme), which change rarely, so context re-renders cost nothing noticeable.
