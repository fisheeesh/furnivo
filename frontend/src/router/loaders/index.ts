import api, { authApi } from '@/api'
import { categoryTypeQuery, onePostQuery, postInfiniteQuery, postQuery, productInfiniteQuery, productQuery, queryClient } from '@/api/query'
import useAuthStore, { Status } from '@/store/authStore'
import { redirect, type LoaderFunctionArgs } from 'react-router'

export const homeLoaderWithReactRouter = async () => {
    try {
        const products = await api.get("/user/products?limit=8")
        const posts = await api.get("/user/posts/infinite?limit=3")

        return {
            productsData: products.data,
            postsData: posts.data,
        }
    } catch (error) {
        console.log(error)
    }
}

export const homeLoader = async () => {
    //* ensureQueryData -> fetch and store in cache. For future use, check in cache fist if cache hit return it or miss fetch it
    await queryClient.ensureQueryData(productQuery("?limit=8"))
    await queryClient.ensureQueryData(postQuery("?limit=3"))

    return null
}

export const loginLoader = async () => {
    try {
        const res = await authApi.get("auth-check")

        if (res.status !== 200) {
            return null
        }

        return redirect("/")
    } catch (error) {
        console.log(error)
    }
}

export const OTPLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.otp) {
        return redirect("/register")
    }

    return null
}

export const confirmPasswordLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.confirm) {
        return redirect("/register")
    }

    return null
}

export const blogInfiniteLoader = async () => {
    //* check if cache hit return it or miss fetch it
    await queryClient.ensureInfiniteQueryData(postInfiniteQuery())

    return null
}

export const postLoader = async ({ params }: LoaderFunctionArgs) => {
    if (!params.postId) {
        throw new Error("No Post ID provided.")
    }

    await queryClient.ensureQueryData(postQuery("?limit=6"))
    await queryClient.ensureQueryData(onePostQuery(+params.postId))

    return { postId: params.postId }
}

export const productsInfiniteLoader = async () => {
    await queryClient.ensureQueryData(categoryTypeQuery())
    /**
     * * mu yin data is always changing -> might be a problem in UI and if we use ensureQueryData we are not sure that data is already in cache 
     * * so we need to prefetch and show previous data while waiting for new data (we made it in query)
     */
    await queryClient.prefetchInfiniteQuery(productInfiniteQuery())

    return null
}