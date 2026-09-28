import { useState } from "react";
import SellerProductCard from "../components/SellerProductCard";
import SellerLayout from "../../../../app/Layouts/SellerLayout";
import { useSeller } from "../../../seller/hooks/sellerHook";
import Loading from '../../../../shared/ui/pages/Loading'
import ProductForm from '../pagess/ProductForm'

const SellerDashboard = () => {

  const [activePage, setActivePage] = useState("all");

  const {data, isPending, isError, handleListProduct, handleDeleteProduct, handleUnlistProduct} = useSeller()

  if(isPending){
    return <Loading />
  }
    
  const products = data?.data?.products || []

  const getProducts = () => {

    if (activePage === "listed") {
      return products.filter(
        (product) => product.isListed
      );
    }

    if (activePage === "unlisted") {
      return products.filter(
        (product) => !product.isListed
      );
    }

    return products;
  };

  const getTitle = () => {

    if (activePage === "listed") {
      return "Listed Products";
    }

    if (activePage === "unlisted") {
      return "Unlisted Products";
    }

    return "All Products";
  };

  const renderProducts = () => {

    const currentProducts = getProducts();

    return (
      <div>

        {/* Header */}
        <div className="mb-8">

          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Seller Dashboard
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {getTitle()}
          </h1>

          <p className="text-gray-500 mt-2">
            {currentProducts.length} products available
          </p>

        </div>

        {/* Products */}
        {currentProducts.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">

            <h2 className="text-lg font-semibold text-gray-900">
              {isError ? "Failed to load products" : "No products found"}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {isError
                ? "Something went wrong while fetching your products. Please refresh the page."
                : "There are no products in this section."}
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {currentProducts.map((product) => (
              <SellerProductCard
                key={product._id}
                product={product}
                handleDeleteProduct={handleDeleteProduct}
                handleListProduct={handleListProduct}
                handleUnlistProduct={handleUnlistProduct}
              />
            ))}

          </div>

        )}

      </div>
    );
  };

  return (
    <SellerLayout
      activePage={activePage}
      setActivePage={setActivePage}
    >

      {activePage === "create"
        ? <ProductForm onSuccess={() => setActivePage("all")} />
        : renderProducts()
      }

    </SellerLayout>
  );
};

export default SellerDashboard;