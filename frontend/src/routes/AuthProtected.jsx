import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import Loading from '../shared/ui/pages/Loading'

const AuthProtected = () => {
  const {user, isLoading} = useSelector(state=>state.auth)

  if(isLoading){
    return <Loading />
  }

  // Already logged in: keep them out of the login/register pages
  if(user){
    return <Navigate to={user.role === "seller" ? "/seller" : "/"} replace />
  }

  return <Outlet />
}

export default AuthProtected
