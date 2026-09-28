import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import {
    getAllProduct,
    deleteProduct,
    listProduct,
    unlistProduct,
    SELLER_PRODUCTS_KEY,
    PUBLIC_PRODUCTS_KEY,
} from "../api/selllerApi"
import { getErrorMessage } from "../../../shared/utils/getErrorMessage"

export const useSeller = () => {

    const queryClient = useQueryClient()

    const {data, isPending, isError} = useQuery({
        queryKey: SELLER_PRODUCTS_KEY,
        queryFn: getAllProduct,
        retry: 1
    })

    // Patch the cached list immediately so the UI updates right away;
    // the background refetch below then confirms it with the server.
    const patchProducts = (updater) => {
        queryClient.setQueryData(SELLER_PRODUCTS_KEY, (old) => {
            if (!old?.data?.products) return old
            return { ...old, data: { ...old.data, products: updater(old.data.products) } }
        })
    }

    const mutationOptions = (successMessage, fallbackError, applyLocally) => ({
        onSuccess: (_response, id) => {
            applyLocally?.(id)
            toast.success(successMessage)
            queryClient.invalidateQueries({ queryKey: SELLER_PRODUCTS_KEY })
            queryClient.invalidateQueries({ queryKey: PUBLIC_PRODUCTS_KEY })
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, fallbackError))
        }
    })

    // NOTE: the backend field is `isListed`
    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        ...mutationOptions("Product deleted", "Failed to delete product",
            (id) => patchProducts((list) => list.filter((p) => p._id !== id)))
    })

    const listMutation = useMutation({
        mutationFn: listProduct,
        ...mutationOptions("Product listed", "Failed to list product",
            (id) => patchProducts((list) => list.map((p) => p._id === id ? { ...p, isListed: true } : p)))
    })

    const unlistMutation = useMutation({
        mutationFn: unlistProduct,
        ...mutationOptions("Product unlisted", "Failed to unlist product",
            (id) => patchProducts((list) => list.map((p) => p._id === id ? { ...p, isListed: false } : p)))
    })

    const handleDeleteProduct = (id) => {
        if (confirm("Confirm Deletion of Product")) {
            deleteMutation.mutate(id)
        }
    }

    const handleListProduct = (id) => listMutation.mutate(id)

    const handleUnlistProduct = (id) => unlistMutation.mutate(id)

    return {
        data,
        isPending,
        isError,
        handleDeleteProduct,
        handleListProduct,
        handleUnlistProduct,
    }

}
