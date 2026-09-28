import SellerProductCard from "../components/SellerProductCard";

const ListedProducts = ({ products = [] }) => {

  const listedProducts = products.filter(
    (product) => product.isListed
  );

  return (
    <div>

      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        Seller Dashboard
      </p>

      <h1 className="text-3xl font-bold text-gray-900 mt-2">
        Listed Products
      </h1>

      <p className="text-gray-500 mt-2 mb-8">
        {listedProducts.length} products listed
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {listedProducts.map((product) => (
          <SellerProductCard
            key={product._id}
            product={product}
          />
        ))}

      </div>

    </div>
  );
};

export default ListedProducts;