import {useForm} from 'react-hook-form'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {toast} from 'react-toastify'
import {createProduct, SELLER_PRODUCTS_KEY, PUBLIC_PRODUCTS_KEY} from '../api/selllerApi'
import {getErrorMessage} from '../../../shared/utils/getErrorMessage'

// Limits enforced by the backend (product.validator.js / multer config)
export const ALLOWED_SIZES = ["XS", "M", "L", "XL", "XXL"]
export const MAX_IMAGES = 5
export const MAX_IMAGE_SIZE = 1 * 1024 * 1024 // 1 MB

// "m, l ,XL" -> ["M", "L", "XL"]
export const parseSizes = (value = "") =>
    [...new Set(
        value
            .split(",")
            .map((s)=>s.trim().toUpperCase())
            .filter(Boolean)
    )]

// onSuccess: optional callback (the dashboard uses it to switch back to the product list)
export const useCreateProduct = ({onSuccess} = {})=>{

    const {register, handleSubmit, formState:{errors}, reset} = useForm()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: ()=>{
            toast.success("Product created")
            queryClient.invalidateQueries({queryKey: SELLER_PRODUCTS_KEY})
            queryClient.invalidateQueries({queryKey: PUBLIC_PRODUCTS_KEY})
            reset()
            onSuccess?.()
        },
        onError: (error)=>{
            toast.error(getErrorMessage(error, "Failed to create product"))
        }
    })

    const handleCreateProduct = (data)=>{

        const formData = new FormData()

        formData.append("title", data.title.trim())
        formData.append("description", data.description.trim())

        formData.append("price", JSON.stringify({
            amount: Number(data.priceAmount),
            currency: "INR",
        }))

        // one entry per size, each with the entered stock
        const sizes = parseSizes(data.size).map((size)=>({size, stock: Number(data.stock)}))
        formData.append("sizes", JSON.stringify(sizes))

        Array.from(data.images).forEach((file)=>{
            formData.append("images", file)
        })

        mutation.mutate(formData)
    }

    return {register, errors, handleSubmit, handleCreateProduct, isCreating: mutation.isPending}

}
