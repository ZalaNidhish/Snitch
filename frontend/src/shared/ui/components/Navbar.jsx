import {ArrowRight} from 'lucide-react';
import { useAuth } from '../../../features/auth/hooks/AuthHook';

const Navbar = ({buttonText="Get Started"}) => {
  
  const {user, navigate, logoutUser} = useAuth()

  let url;

  if(buttonText == "Home"){
    url = '/'
  }else if(buttonText == "Get Started"){
    url = '/auth'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          snitch
        </h1>

        {/* Get Started */}
        
        {user ? (
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Logout
              <ArrowRight size={17} />
            </button>) 
            : (
            <button
              onClick={() => navigate(url)}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              {buttonText}
              <ArrowRight size={17} />
            </button>
          )
        }

      </div>
    </nav>
  );
};

export default Navbar;