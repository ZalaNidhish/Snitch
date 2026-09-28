import {useCreateProduct, parseSizes, ALLOWED_SIZES, MAX_IMAGES, MAX_IMAGE_SIZE} from '../../hooks/productHook'

import {
  Package,
  IndianRupee,
  Image,
  AlignLeft,
  Layers,
} from "lucide-react";

const ProductForm = ({ onSuccess }) => {

  const {register, handleSubmit, handleCreateProduct, errors, isCreating} = useCreateProduct({ onSuccess })

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="mb-8">

        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Seller
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Create Product
        </h1>

        <p className="text-gray-500 mt-2">
          Add a new product to your store.
        </p>

      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">

        <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-6">

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title
            </label>

            <div className="relative">

              <Package
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                {...register('title', {
                  required: "Product Title is required",
                  minLength: { value: 2, message: "Title must contain atleast 2 characters" },
                  maxLength: { value: 30, message: "Title can contain at most 30 characters" }
                })}
                type="text"
                placeholder="Enter product title"
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              {errors.title && <p className='text-red-600'>{errors.title.message}</p>}

            </div>

          </div>

          {/* Description */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <div className="relative">

              <AlignLeft
                size={19}
                className="absolute left-3 top-3 text-gray-400"
              />

              <textarea
                {...register('description', {
                  required: "Product Description is required",
                  minLength: { value: 10, message: "Description must contain atleast 10 characters" },
                  maxLength: { value: 500, message: "Description can contain at most 500 characters" }
                })}
                rows="4"
                placeholder="Describe your product"
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
              />
              {errors.description && <p className='text-red-600'>{errors.description.message}</p>}

            </div>

          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>

              <div className="relative">

                <IndianRupee
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                {...register('priceAmount', {
                  required: "Product price is required",
                  min: { value: 0, message: "Price cannot be negative" }
                })}
                  type="number"
                  placeholder="1000"
                  className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              {errors.priceAmount && <p className='text-red-600'>{errors.priceAmount.message}</p>}


              </div>

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>

              <div className="relative">

                <Layers
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                {...register('stock', {
                  required: "Product stock is required",
                  min: { value: 0, message: "Stock cannot be negative" },
                  validate: (value) => Number.isInteger(Number(value)) || "Stock must be a whole number"
                })}
                  type="number"
                  placeholder="100"
                  className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              {errors.stock && <p className='text-red-600'>{errors.stock.message}</p>}


              </div>

            </div>

          </div>

          {/* Size */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>

            <input
                {...register('size', {
                  required: "Product size is required",
                  validate: (value) => {
                    const sizes = parseSizes(value)
                    if (sizes.length === 0) return "Enter at least one size"
                    const invalid = sizes.filter((s) => !ALLOWED_SIZES.includes(s))
                    return invalid.length === 0 || `Allowed sizes: ${ALLOWED_SIZES.join(", ")}`
                  }
                })}
              type="text"
              placeholder="Comma separated: XS, M, L, XL, XXL"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
              {errors.size && <p className='text-red-600'>{errors.size.message}</p>}


          </div>

          {/* Image URL */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>

            <div className="relative">

              <Image
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                {...register('images', {
                  required: "Product images is required",
                  validate: (files) => {
                    if (!files || files.length === 0) return "Product images is required"
                    if (files.length > MAX_IMAGES) return `You can upload at most ${MAX_IMAGES} images`
                    for (const file of files) {
                      if (!file.type.startsWith("image/")) return `${file.name} is not an image`
                      if (file.size > MAX_IMAGE_SIZE) return `${file.name} is larger than 1 MB`
                    }
                    return true
                  }
                })}
                type="file"
                accept="image/*"
                multiple
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              {errors.images && <p className='text-red-600'>{errors.images.message}</p>}


            </div>

          </div>

          {/* Submit */}
          <div className="pt-3">

            <button
              type="submit"
              disabled={isCreating}
              className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating..." : "Create Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ProductForm;