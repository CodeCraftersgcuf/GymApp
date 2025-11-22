import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct, getProductsAuthenticated } from '../services/productService';
import { useAuth } from '../../contexts/AuthContext';

/**
 * React Query hooks for Products
 */

/**
 * Hook to get list of products (public)
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => getProducts(params),
    ...options,
  });
};

/**
 * Hook to get list of products (authenticated - may include user-specific data)
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useProductsAuthenticated = (params = {}, options = {}) => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['products', 'authenticated', 'list', params],
    queryFn: () => getProductsAuthenticated(params),
    enabled: !!token && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to get single product by ID
 * @param {number|string} id - Product ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useProduct = (id, options = {}) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

