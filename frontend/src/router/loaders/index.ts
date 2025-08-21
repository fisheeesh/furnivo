import api, { authApi } from '@/api'
import { postQuery, productQuery, queryClient } from '@/api/query'
import useAuthStore, { Status } from '@/store/authStore'
import { redirect } from 'react-router'

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