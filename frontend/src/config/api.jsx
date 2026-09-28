import axios from 'axios'
import { extractToken } from '../features/auth/utils/extractToken'

export const TOKEN_KEY = "snitch_accessToken"

const DEPLOYED_API = "https://snitch-beka.onrender.com/api"

export const api = axios.create({
    // dev: "/api" (Vite proxy -> same origin -> refresh cookie works)
    // prod: the deployed backend (override with VITE_API_URL)
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : DEPLOYED_API),
    // Only enable when the backend allows credentialed CORS (its cors() is currently a wildcard,
    // and a wildcard + credentials makes the browser block every request).
    withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === "true",
})

// Ignores junk values such as the string "undefined" that older builds could store
export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return token && token !== "undefined" && token !== "null" ? token : null
}

// Attach the access token to every request
api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const SKIP_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh"]

let refreshPromise = null

// Backend: an expired/invalid access token answers 401 -> refresh once and retry.
// (A missing or blacklisted token answers 400, which is NOT refreshable, so it is passed through.)
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config

        if (
            !original ||
            error.response?.status !== 401 ||
            original._retry ||
            SKIP_REFRESH.some((path) => original.url?.includes(path))
        ) {
            return Promise.reject(error)
        }

        original._retry = true

        // 1) Refresh (one shared request even if several calls 401 at once)
        let accessToken
        try {
            if (!refreshPromise) {
                refreshPromise = api.post("/auth/refresh").finally(() => {
                    refreshPromise = null
                })
            }
            const { data } = await refreshPromise
            accessToken = extractToken(data)
            if (!accessToken) throw new Error("No access token in refresh response")
            localStorage.setItem(TOKEN_KEY, accessToken)
        } catch (refreshError) {
            // Session is over if the server rejected the refresh (or answered without a token).
            // A plain network error must not log the user out.
            const serverRejected = !!refreshError.response || !refreshError.isAxiosError
            if (serverRejected) {
                localStorage.removeItem(TOKEN_KEY)
                window.dispatchEvent(new Event("auth:expired"))
            }
            return Promise.reject(refreshError)
        }

        // 2) Retry the original request with the new token
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
    }
)
