import {createSlice} from '@reduxjs/toolkit'
import {HydrateUserAction, LoginUserAction, LogoutUserAction, RegisterUserAction} from '../state/AuthActions'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,          // plain user object, e.g. { role: "seller", ... }
        isLoading: true,     // session check (hydrate) / logout: route guards wait on this
        isSubmitting: false  // login / register in progress: keeps the form mounted
    },
    reducers: {
        clearUser: (state) => {
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(LoginUserAction.pending, (state)=>{
            state.isSubmitting = true
        })
        .addCase(LoginUserAction.fulfilled, (state, action)=>{
            state.user = action.payload
            state.isSubmitting = false
        })
        .addCase(LoginUserAction.rejected, (state)=>{
            state.isSubmitting = false
        })
        .addCase(RegisterUserAction.pending, (state)=>{
            state.isSubmitting = true
        })
        .addCase(RegisterUserAction.fulfilled, (state, action)=>{
            state.user = action.payload
            state.isSubmitting = false
        })
        .addCase(RegisterUserAction.rejected, (state)=>{
            state.isSubmitting = false
        })
        .addCase(HydrateUserAction.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(HydrateUserAction.fulfilled, (state, action)=>{
            state.user = action.payload
            state.isLoading = false
        })
        .addCase(HydrateUserAction.rejected, (state)=>{
            state.user = null
            state.isLoading = false
        })
        .addCase(LogoutUserAction.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(LogoutUserAction.fulfilled, (state)=>{
            state.user = null
            state.isLoading = false
        })
    }
})

export const {clearUser} = authSlice.actions
export default authSlice.reducer
