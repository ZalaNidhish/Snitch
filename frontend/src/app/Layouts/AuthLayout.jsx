import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../../shared/ui/components/Navbar'


const AuthLayout = () => {
    return (
        <div className='h-screen'>
            <Navbar buttonText={"Home"}/>
            <Outlet />
        </div>
    )

}

export default AuthLayout