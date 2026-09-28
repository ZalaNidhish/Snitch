import React, { useEffect } from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router'
import AuthProtected from '../routes/AuthProtected'
import SellerProtected from '../routes/SellerProtected'
import AuthLayout from '../app/Layouts/AuthLayout'
import LoginPage from '../features/auth/ui/LoginPage'
import RegisterPage from '../features/auth/ui/RegisterPage'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { HydrateUserAction } from '../features/auth/state/AuthActions'
import { clearUser } from '../features/auth/state/AuthSlice'
import ProductsPage from '../features/user/ui/pages/ProductsPage'
import SellerDashboard from '../features/seller/ui/pagess/SellerDashboard'
import ProductDetailsPage from '../features/user/ui/pages/ProductDetailsPage'
import SellerProductDetailsPage from '../features/seller/ui/pagess/SellerProductDetailPage'
import EditProductPage from '../features/seller/ui/pagess/EditProductPage'

const router = createBrowserRouter([
  {
    path:'/',
    element: <ProductsPage />,
  },
  {
    path: '/product/:id',
    element: <ProductDetailsPage />
  },
  {
    path:'/auth',
    element: <AuthProtected />,
    children: [
      {
        path: '',
        element: <AuthLayout />,
        children: [
          {
            path: '',
            element: <LoginPage />
          },
          {
            path: 'register',
            element: <RegisterPage />
          }
        ]
      }
    ]
  },
  {
    path: '/seller',
    element: <SellerProtected />,
    children: [
      {
        path: '',
        element: <SellerDashboard />
      },
      {
        path: 'product/:id',
        element: <SellerProductDetailsPage />
      },
            {
        path: 'product/edit/:id',
        element: <EditProductPage />
      }

    ]
  }
])

const AppRoutes = () => {

  const dispatch = useDispatch()

  // Restore the session on page load
  useEffect(()=>{
    dispatch(HydrateUserAction())
  }, [dispatch])

  // The axios interceptor fires this when a refresh is rejected mid-session
  useEffect(()=>{
    const onExpired = ()=> {
      dispatch(clearUser())
      toast.info("Session expired. Please log in again.")
    }
    window.addEventListener("auth:expired", onExpired)
    return ()=> window.removeEventListener("auth:expired", onExpired)
  }, [dispatch])

  return (
    <RouterProvider router={router}/>
  )
}

export default AppRoutes
