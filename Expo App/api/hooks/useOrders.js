import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../services/orderService';

/**
 * React Query hooks for Orders
 */

/**
 * Hook to create a new order
 * @returns {object} - Mutation object with mutate function
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate products list to reflect updated availability
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

