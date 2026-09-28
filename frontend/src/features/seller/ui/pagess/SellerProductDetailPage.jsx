import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Pencil, Package, DollarSign, Layers } from 'lucide-react'
import Loading from '../../../../shared/ui/pages/Loading'
import { getProduct } from '../../../user/hooks/productsHook'

const SellerProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isPending } = getProduct(id)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (isPending) return <Loading />

  const product = data?.data?.product

  if (!product) {
    return (
      <div className="p-10 flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    )
  }

  const mainImage = product?.images?.[selectedImageIndex] || product?.images?.[0]

  const totalStock = product.sizes?.reduce(
    (acc, item) => acc + (item.stock ?? 0), 0
  ) ?? 0

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Action Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Edit Product Button */}
        <button
          onClick={() => navigate(`/seller/product/edit/${product._id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          <Pencil size={16} />
          Edit Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Product Media */}
          <div className="flex flex-col gap-4">
            <div className="relative h-[420px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg bg-gray-100 border-2 overflow-hidden flex-shrink-0 transition ${
                      selectedImageIndex === idx
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Seller Overview
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mt-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  product.isListed 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {product.isListed ? "Listed" : "Unlisted"}
                </span>
              </div>

              <div className="mt-6 border-y border-gray-100 py-4">
                <p className="text-xs text-gray-400 mb-1">PRICE</p>
                <p className="text-3xl font-bold text-gray-900">
                  {product.price?.currency} {product.price?.amount}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Inventory details */}
              {product.sizes?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Inventory Breakdown
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.sizes.map((item, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <p className="text-xs text-gray-400 uppercase">Size</p>
                        <p className="text-sm font-bold text-gray-900">
                          {Array.isArray(item.size) ? item.size.join(', ') : item.size}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Stock: <span className="font-semibold text-black">{item.stock}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                  <Package size={18} className="text-gray-600 mb-1" />
                  <span className="text-xs text-gray-400">Total Units</span>
                  <span className="text-sm font-bold text-gray-900">{totalStock}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                  <DollarSign size={18} className="text-gray-600 mb-1" />
                  <span className="text-xs text-gray-400">Unit Price</span>
                  <span className="text-sm font-bold text-gray-900">{product.price?.amount}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                  <Layers size={18} className="text-gray-600 mb-1" />
                  <span className="text-xs text-gray-400">Variants</span>
                  <span className="text-sm font-bold text-gray-900">{product.sizes?.length || 0}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default SellerProductDetailsPage