import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateProductApi, SELLER_PRODUCTS_KEY, PUBLIC_PRODUCTS_KEY } from '../api/selllerApi';
import { getErrorMessage } from '../../../shared/utils/getErrorMessage';


export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      toast.success('Product updated');
      // ["products"] also covers ["products", id] (single product page)
      queryClient.invalidateQueries({ queryKey: SELLER_PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_PRODUCTS_KEY });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update product'));
    },
  });
};