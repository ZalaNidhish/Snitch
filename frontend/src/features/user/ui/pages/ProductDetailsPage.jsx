import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import Navbar from '../../../../shared/ui/components/Navbar';
import { Navigate, useParams } from 'react-router';
import { getProduct } from '../../hooks/productsHook';
import Loading from '../../../../shared/ui/pages/Loading'
import { useState } from 'react';

const ProductDetailsPage = () => {

    const {id} = useParams()
    const {data, isPending} = getProduct(id)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    

    if(isPending) return <Loading />

    const product = data.data.product

    const mainImage = product?.images?.[selectedImageIndex] || product?.images?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Column: Image Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main Image Container */}
              <div className="relative h-[420px] md:h-[500px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail List */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    onClick={()=>setSelectedImageIndex(idx)}
                    key={idx}
                    className={`relative w-20 h-20 rounded-lg bg-gray-100 border-2 overflow-hidden flex-shrink-0 transition ${
                      idx === 0 ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Product Info & Actions */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category & Title */}
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Product Details
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-2">
                  {product.title}
                </h1>

                {/* Rating Sample / Stock Indicator */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" className="text-gray-300" />
                    <span className="text-xs text-gray-500 ml-2 font-medium">(4.0 / 5)</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    In Stock ({product.sizes[0].stock} available)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-6 border-y border-gray-100 py-4">
                  <p className="text-xs text-gray-400 mb-1">PRICE</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {product.price.currency} {product.price.amount}
                  </p>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Size Selector */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Select Size
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes[0].size.map((size, idx) => (
                      <button
                        key={size}
                        className={`min-w-[48px] px-4 py-2 text-sm font-medium rounded-lg border transition ${
                          idx === 1
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions & Value Props */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="p-3.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition">
                    <Heart size={20} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Truck size={20} className="text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <ShieldCheck size={20} className="text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">2 Year Warranty</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <RefreshCw size={20} className="text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">30 Days Return</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;