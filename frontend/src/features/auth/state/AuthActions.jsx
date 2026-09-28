import {api, TOKEN_KEY, getToken} from '../../../config/api'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {toast} from 'react-toastify'
import {extractUser} from '../utils/extractUser'
import {extractToken} from '../utils/extractToken'
import {getErrorMessage} from '../../../shared/utils/getErrorMessage'

const saveSession = (body) => {
    const token = extractToken(body)
    if (!token) throw new Error("No access token in response")
    localStorage.setItem(TOKEN_KEY, token)
    return extractUser(body)
}

export const LoginUserAction = createAsyncThunk("Auth/login", async (data, thunkApi)=>{
    try {
        const response = await api.post('/auth/login', data)
        return saveSession(response.data)
    } catch (error) {
        const message = getErrorMessage(error, "Login failed")
        toast.error(message)
        return thunkApi.rejectWithValue(message)
    }
})

export const RegisterUserAction = createAsyncThunk("Auth/register", async (data, thunkApi)=>{
    try {
        const response = await api.post('/auth/register', data)
        return saveSession(response.data)
    } catch (error) {
        const message = getErrorMessage(error, "Registration failed")
        toast.error(message)
        return thunkApi.rejectWithValue(message)
    }
})

// Logout always succeeds locally, even if the server call fails
export const LogoutUserAction = createAsyncThunk("Auth/logout", async ()=>{
    try {
        await api.post('/auth/logout')
    } catch {
        // ignore: we still clear the local session below
    } finally {
        localStorage.removeItem(TOKEN_KEY)
    }
    return null
})

export const HydrateUserAction = createAsyncThunk("Auth/hydrate", async (_, thunkApi)=>{
    // Nothing stored -> nobody is logged in (the backend answers 400 without a token anyway)
    if (!getToken()) {
        return thunkApi.rejectWithValue("No token found")
    }

    try {
        // An expired token (401) is refreshed automatically by the axios interceptor
        const response = await api.get('/auth/me')
        return extractUser(response.data)
    } catch (error) {
        // 400 = blacklisted/missing token, 401 = invalid even after refresh -> drop it.
        // Network errors / cold starts keep the token so a reload can recover.
        if ([400, 401].includes(error.response?.status)) {
            localStorage.removeItem(TOKEN_KEY)
        }
        return thunkApi.rejectWithValue("Error in hydrating user")
    }
})
