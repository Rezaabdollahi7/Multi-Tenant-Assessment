/** A User's name for display; the API allows Users without one. */
export function displayName(name: string | null) {
  return name ?? "Unnamed User";
}
