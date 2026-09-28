import { User, Mail, Lock } from "lucide-react";
import {useAuth} from '../hooks/AuthHook'
import Loading from "../../../shared/ui/pages/Loading"

const RegisterPage = () => {

  const {register, handleSubmit, registerUser, errors, isLoading, isSubmitting, navigate} = useAuth()
  
  if(isLoading){
    return <Loading />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* App Name */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            snitch
          </h1>
          <p className="text-gray-500 mt-2">
            Create your account to get started.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(registerUser)} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>

            <div className="relative">
              <User
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                {...register('name', {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must contain atleast 2 characters"
                  },
                  maxLength: {
                    value: 50,
                    message: "Name can contain at most 50 characters"
                  }
                })}
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}

            </div>
          </div>

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
                  minLength: {
                    value: 6,
                    message: "Password must contain atleast 6 characters"
                  }
                })}
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}

            </div>
          </div>

          {/* Register Button */}
          <button
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span onClick={()=>{navigate('/auth')}} className="text-black font-medium cursor-pointer">
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
