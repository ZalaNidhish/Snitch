import { LogOut } from "lucide-react";

const SellerNavbar = ({ userName = "User", onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          snitch
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          <p className="hidden sm:block text-sm text-gray-600">
            Hello,{" "}
            <span className="font-semibold text-gray-900">
              {userName}
            </span>{" "}
            👋
          </p>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;