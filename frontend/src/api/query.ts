/* eslint-disable @typescript-eslint/no-unused-vars */
//* react router + tanstack query -> 4 steps -> 1. Create fetch func -> 2. Define query -> 3. Create loader -> 4. Call in respective pages
import { keepPreviousData, QueryClient } from '@tanstack/react-query';
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

const fetchCategoryType = async () => {
    const res = await api.get("/user/filter-type")

    return res.data
}

export const categoryTypeQuery = () => ({
    queryKey: ['category', "type"],
    queryFn: fetchCategoryType
})

const fetchInfiniteProducts = async ({ pageParam = null, categories = null, types = null }: {
    pageParam?: number | null,
    categories?: string | null,
    types?: string | null
}) => {
    let query = pageParam ? `?limit=9&cursor=${pageParam}` : "?limit=9";
    if (categories) query += `&category=${categories}`
    if (types) query += `&type=${types}`
    const res = await api.get(`/user/products${query}`)

    return res.data
}

export const productInfiniteQuery = (categories: string | null = null, types: string | null = null) => ({
    queryKey: ['products', 'infinite', categories ?? undefined, types ?? undefined],
    queryFn: ({ pageParam }: { pageParam?: number | null }) => fetchInfiniteProducts({ pageParam, categories, types }),
    //* nouk hr twy fetch ny tae a chain pya loh ya ag or error tat nai
    placeholderData: keepPreviousData,
    initialPageParam: null,
    // @ts-expect-error ignore type check
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined
})

const fetchOneProduct = async (id: number) => {
    const res = await api.get(`/user/products/${id}`)

    return res.data
}

export const oneProductQuery = (id: number) => ({
    queryKey: ['product', id],
    queryFn: () => fetchOneProduct(id)
})