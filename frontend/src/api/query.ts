/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryClient } from '@tanstack/react-query';
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

const fetchInfinitePosts = async ({ pageParam = null }) => {
    const query = pageParam ? `?limit=6&cursor=${pageParam}` : "?limit=6"
    const res = await api.get(`/user/posts/infinite${query}`)

    return res.data
}

export const postInfiniteQuery = () => ({
    queryKey: ['posts', "infinite"],
    queryFn: fetchInfinitePosts,
    //* start with no cursor
    initialPageParam: null,
    // @ts-expect-error ignore type check
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
    // getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor ?? undefined
    // maxPages: 6
})

const fetchOnePost = async (id: number) => {
    const res = await api.get(`/user/posts/${id}`)

    if (!res) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found"
        })
    }

    return res.data
}

export const onePostQuery = (id: number) => ({
    queryKey: ['post', id],
    queryFn: () => fetchOnePost(id)
})