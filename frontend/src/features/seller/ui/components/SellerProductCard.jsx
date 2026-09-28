import {
  Eye,
  EyeOff,
  Package,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

const SellerProductCard = ({ product, handleUnlistProduct, handleDeleteProduct, handleListProduct }) => {

  const isListed = product.isListed;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition duration-300">

      {/* Image -> Clickable link to Seller Detail Page */}
      <Link to={`/seller/product/${product._id}`} className="block relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-5">

        {/* Title -> Clickable link to Seller Detail Page */}
        <div className="flex items-start justify-between gap-3">
          <Link to={`/seller/product/${product._id}`} className="hover:text-gray-600 transition">
            <h2 className="text-lg font-semibold text-gray-900">
              {product.title}
            </h2>
          </Link>

          <Package
            size={18}
            className="text-gray-400 shrink-0"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price / Stock */}
        <div className="grid grid-cols-2 gap-4 mt-5">

          <div>
            <p className="text-xs text-gray-400 mb-1">
              PRICE
            </p>

            <p className="text-lg font-bold text-gray-900">
              {product.price?.currency}{" "}
              {product.price?.amount}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">
              STOCK
            </p>

            <p className="text-sm font-medium text-gray-900">
              {product.sizes?.reduce((total, item) => total + (item.stock ?? 0), 0) ?? 0}
            </p>
          </div>

        </div>

        {/* List / Unlist & Delete */}
        <div className="flex gap-3 w-full">
        
          { isListed ? (
            <button
              onClick={() => handleUnlistProduct(product._id)}
              className="w-[70%] mt-5 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <EyeOff size={17} />
              Unlist Product
            </button>
          ) : (
            <button
              onClick={() => handleListProduct(product._id)}
              className="w-[70%] mt-5 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition bg-black text-white hover:bg-gray-800"
            >
              <Eye size={17} />
              List Product
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => handleDeleteProduct(product._id)}
            className="w-[30%] mt-5 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition"
          >
            <Trash2 size={17} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default SellerProductCard;