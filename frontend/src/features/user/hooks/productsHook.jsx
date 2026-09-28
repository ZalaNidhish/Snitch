import {useQuery} from '@tanstack/react-query'
import { getAllProducts, getSingleProduct } from '../api/productsApi'
import { PUBLIC_PRODUCTS_KEY } from '../../seller/api/selllerApi'

export const useProducts = ()=>{

    const {data, isPending} = useQuery({
        queryKey: PUBLIC_PRODUCTS_KEY,
        queryFn: getAllProducts,
    })

    return {data, isPending}
}

export const getProduct = (id)=>{


    const {data, isPending} = useQuery({
        queryKey: ["products", id],
        queryFn: ()=>getSingleProduct(id),
    })

    return {data, isPending}

}