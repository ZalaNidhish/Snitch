import {
  LayoutDashboard,
  Eye,
  EyeOff,
  Plus,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../auth/hooks/AuthHook";

const SellerSidebar = ({
  activePage,
  setActivePage,
}) => {

  const navItems = [
    {
      id: "all",
      label: "View All Products",
      icon: LayoutDashboard,
    },
    {
      id: "listed",
      label: "Listed Products",
      icon: Eye,
    },
    {
      id: "unlisted",
      label: "Unlisted Products",
      icon: EyeOff,
    },
    {
      id: "create",
      label: "Create Product",
      icon: Plus,
    },
  ];

  const {logoutUser} = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50">

      <div className="h-full flex flex-col">

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            snitch
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-hidden">

          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Seller
          </p>

          <div className="space-y-1">

            {navItems.map((item) => {

              const Icon = item.icon;

              const isActive =
                activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            })}

          </div>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 shrink-0">

          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <LogOut size={18} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </div>

    </aside>
  );
};

export default SellerSidebar;