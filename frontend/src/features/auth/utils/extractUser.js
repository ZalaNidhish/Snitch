// The backend returns the user in different shapes depending on the route:
//   login    -> { data: { email, name, role, id } }
//   register -> { data: { user: { email, name, id } } }        (no role -> new accounts are "user")
//   me       -> { data: { user: { email, name, role, id } } }
// Normalise once here so the rest of the app only deals with a plain user that has `role`.
export const extractUser = (body) => {
    const user = body?.data?.user ?? body?.data ?? body?.user ?? null
    if (!user || typeof user !== "object") return null
    return { ...user, role: user.role ?? "user" }
}
