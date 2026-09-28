import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Loading from '../../../../shared/ui/pages/Loading';
import { getProduct } from '../../../user/hooks/productsHook'; 
import { useUpdateProduct } from '../../hooks/updateProductHook'

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = getProduct(id);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: { amount: '', currency: 'INR' },
    sizes: [{ size: '', stock: 0 }],
    images: [''],
  });

  // Pre-fill form when product data is loaded
  useEffect(() => {
    if (data?.data?.product) {
      const product = data.data.product;
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: {
          amount: product.price?.amount || '',
          currency: product.price?.currency || 'INR',
        },
        // DB stores size as ["M"]; the form (and the API) want plain "M". Copy so the query cache is never mutated.
        sizes: product.sizes?.length
          ? product.sizes.map((s) => ({
              size: Array.isArray(s.size) ? s.size[0] : s.size,
              stock: s.stock,
            }))
          : [{ size: '', stock: 0 }],
        images: product.images?.length ? product.images : [''],
      });
    }
  }, [data]);

  if (isPending) return <Loading />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [name]: value },
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = field === 'stock' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSizeRow = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: 0 }],
    }));
  };

  const removeSizeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend expects multipart/form-data with price & sizes as JSON strings (same as create)
    const body = new FormData();
    body.append('title', formData.title.trim());
    body.append('description', formData.description.trim());
    body.append('price', JSON.stringify({
      amount: Number(formData.price.amount),
      currency: formData.price.currency.trim().toUpperCase(),
    }));
    body.append('sizes', JSON.stringify(
      formData.sizes.map((item) => ({
        size: String(item.size).trim().toUpperCase(),
        stock: Number(item.stock),
      }))
    ));

    updateProduct(
      { id, formData: body },
      {
        onSuccess: () => navigate(`/seller/product/${id}`),
      }
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Product Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              value={formData.price.currency}
              onChange={handlePriceChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Price Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.price.amount}
              onChange={handlePriceChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Sizes and Inventory Array */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Sizes & Stock
            </label>
            <button
              type="button"
              onClick={addSizeRow}
              className="flex items-center gap-1 text-xs text-black font-semibold hover:underline"
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {formData.sizes.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Size (XS, M, L, XL, XXL)"
                  value={Array.isArray(item.size) ? item.size.join(', ') : item.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={item.stock}
                  onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                  className="w-28 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                {formData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSizeRow(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          <Save size={16} />
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>

      </form>
    </div>
  );
};

export default EditProductPage;