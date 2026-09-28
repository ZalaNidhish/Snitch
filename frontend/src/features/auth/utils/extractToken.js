// The backend puts the access token in different places depending on the route:
//   login    -> { accessToken, data: { ...user } }
//   register -> { data: { user, accessToken } }
//   refresh  -> { data: { user, accessToken } }
export const extractToken = (body) =>
    body?.accessToken ?? body?.data?.accessToken ?? null
