import {useNavigate} from 'react-router'
import {useForm} from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import {useQueryClient} from '@tanstack/react-query'
import {LoginUserAction, LogoutUserAction, RegisterUserAction} from '../state/AuthActions'

export const useAuth = ()=>{

    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const {user, isLoading, isSubmitting} = useSelector(state=>state.auth)
    const navigate = useNavigate()
    const {register, handleSubmit, formState:{errors}, reset} = useForm()

    const redirectByRole = (loggedUser)=>{
        navigate(loggedUser?.role === "seller" ? "/seller" : "/")
    }

    const loginUser = async (data)=>{
        try {
            const loggedUser = await dispatch(LoginUserAction(data)).unwrap()
            reset()
            redirectByRole(loggedUser)
        } catch {
            // toast already shown in the thunk; form values are kept so the user can retry
        }
    }

    const registerUser = async (data)=>{
        try {
            const newUser = await dispatch(RegisterUserAction(data)).unwrap()
            reset()
            redirectByRole(newUser)
        } catch {
            // toast already shown in the thunk
        }
    }

    const logoutUser = async ()=>{
        await dispatch(LogoutUserAction())
        queryClient.clear() // don't leak the previous account's cached data
        // Route guards (SellerProtected) redirect to /auth once user is null
    }

    return {register, handleSubmit, loginUser, logoutUser, registerUser, errors, reset, navigate, user, isLoading, isSubmitting}

}
