import { ShoppingCart } from "lucide-react";
import { getProduct } from "../../hooks/productsHook";

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition duration-300">

      {/* Image */}
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Title + Size */}
        <div className="flex items-start justify-between gap-3">

          <h2 className="text-lg font-semibold text-gray-900">
            {product.title}
          </h2>

          {/* Size */}
          <div className="flex gap-2">
            {product.sizes?.map((item) =>
              item.size?.map((size) => (
                <span
                  key={size}
                  className="border border-gray-300 rounded-md px-2.5 py-1 text-xs font-medium text-gray-700"
                >
                  {size}
                </span>
              ))
            )}
          </div>

        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Price + Stock */}
        <div className="flex items-center justify-between mt-5">

          {/* Price */}
          <div>
            <p className="text-xs text-gray-400 mb-1">
              PRICE
            </p>

            <p className="text-lg font-bold text-gray-900">
              {product.price?.currency} {product.price?.amount}
            </p>
          </div>

          {/* Stock */}
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">
              STOCK
            </p>

            <p className="text-sm font-medium text-gray-900">
              {product.sizes?.reduce((total, item) => total + (item.stock ?? 0), 0) ?? 0}
            </p>
          </div>

        </div>

        {/* Add to Cart */}
        <button
          className="w-full mt-5 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default ProductCard;