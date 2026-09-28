import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import Loading from '../shared/ui/pages/Loading'

const SellerProtected = () => {
  const {user, isLoading} = useSelector(state=>state.auth)

  if(isLoading) return <Loading />

  // Not logged in (also what happens right after logout)
  if(!user) return <Navigate to="/auth" replace />

  // Logged in but not a seller
  if(user.role !== "seller") return <Navigate to="/" replace />

  return <Outlet />
}

export default SellerProtected
