 
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllCategories, fetchProductsByCategory } from '../services/api';
import { QUERY_KEYS } from './useProducts';

export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: fetchAllCategories,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePrefetchCategory = () => {
  const queryClient = useQueryClient();

  const prefetchCategory = async (categorySlug) => {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PRODUCTS, 'category', categorySlug],
      queryFn: () => fetchProductsByCategory(categorySlug),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchCategory };
};