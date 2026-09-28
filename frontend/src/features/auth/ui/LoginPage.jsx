import { Mail, Lock } from "lucide-react";
import {useAuth} from '../hooks/AuthHook'
import Loading from "../../../shared/ui/pages/Loading"

const LoginPage = () => {

  const {register, handleSubmit, loginUser, errors, isLoading, isSubmitting, navigate} = useAuth()

  if(isLoading){
    return <Loading />
  }

  return (
    <div className="h-[88%] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/* App Name */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            snitch
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Please login to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(loginUser)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                {...register('email', {
                  required: "Email is required"
                })}
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                {...register('password', {
                  required: "Password is required",
                })}
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          {/* Login Button */}
          <button
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <span onClick={()=>{navigate('/auth/register')}} className="text-black font-medium cursor-pointer">
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;