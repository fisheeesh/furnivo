import { QueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '.';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            // retry: 2,
        }
    }
})

const fetchProducts = async (q?: string) => {
    const res = await api.get(`/user/products${q ?? ""}`)

    return res.data
}

export const productQuery = (q?: string) => ({
    queryKey: ['products', q],
    queryFn: () => fetchProducts(q),
})

const fetchPosts = async (q?: string) => {
    const res = await api.get(`/user/posts/infinite${q ?? ""}`)

    return res.data
}

export const postQuery = (q?: string) => ({
    queryKey: ['posts', q],
    queryFn: () => fetchPosts(q)
})