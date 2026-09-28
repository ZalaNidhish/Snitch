import { api } from "../../../config/api"

// Shared query keys so every hook invalidates the same caches
export const SELLER_PRODUCTS_KEY = ["seller-products"]
export const PUBLIC_PRODUCTS_KEY = ["products"]

// No try/catch here on purpose: let errors propagate so react-query / useMutation can handle them.
// The auth token is added by the axios interceptor.

export const getAllProduct = async ()=>{
    const response = await api.get("/product/seller")
    return response.data
}

export const deleteProduct = async (id)=>{
    const response = await api.delete(`/product/${id}`)
    return response.data
}

export const listProduct = async (id)=>{
    const response = await api.post(`/product/list/${id}`)
    return response.data
}

export const unlistProduct = async (id)=>{
    const response = await api.post(`/product/unlist/${id}`)
    return response.data
}

export const createProduct = async (formData)=>{
    const response = await api.post('/product/', formData)
    return response.data
}

export const updateProductApi = async ({ id, formData }) => {
  const { data } = await api.put(`/product/${id}`, formData);
  return data;
};