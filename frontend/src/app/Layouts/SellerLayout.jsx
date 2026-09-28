import SellerSidebar from "../../features/seller/ui/components/SellerSidebar";

const SellerLayout = ({
  children,
  activePage,
  setActivePage,
  onLogout,
}) => {

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Fixed Sidebar */}
      <SellerSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">

        <div className="max-w-7xl mx-auto px-6 py-10">

          {children}

        </div>

      </main>

    </div>
  );
};

export default SellerLayout;