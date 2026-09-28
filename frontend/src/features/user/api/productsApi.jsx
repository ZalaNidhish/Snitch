import {api} from '../../../config/api'

export const getAllProducts = async ()=>{
    const response = await api.get('/product')
    return response.data
}

export const getSingleProduct = async (id)=>{
    const response = await api.get(`/product/${id}`)
    return response.data
}