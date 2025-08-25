import api, { authApi } from '@/api'
import { categoryTypeQuery, onePostQuery, oneProductQuery, postInfiniteQuery, postQuery, productInfiniteQuery, productQuery, queryClient, userDataQuery } from '@/api/query'
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
    await queryClient.ensureQueryData(userDataQuery())

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
        return null
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

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
    if (!params.productId) {
        throw new Error("Not Product ID provided.")
    }

    await queryClient.ensureQueryData(oneProductQuery(+params.productId))
    await queryClient.ensureQueryData(productQuery("?limit=6"))

    return { productId: params.productId }
}

export const verifyOTPLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.verify) {
        return redirect("/forgot-password")
    }

    return null
}

export const resetPasswordLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.reset) {
        return redirect("/forgot-password")
    }

    return null
}

export const profileLoader = async () => {
    await queryClient.ensureQueryData(userDataQuery())

    return null
}