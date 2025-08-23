import api, { authApi } from "@/api";
import { queryClient } from "@/api/query";
import useAuthStore, { Status } from "@/store/authStore";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const credentials = Object.fromEntries(formData)

    try {
        const res = await authApi.post('login', credentials)
        if (res.status !== 200) {
            return {
                error: res.data || "Login failed. Please try again."
            }
        }

        const redirectTo = new URL(request.url).searchParams.get("redirect") || "/"
        return redirect(redirectTo)
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "login Failed" }
        }
        throw error
    }
}

export const logoutAction = async () => {
    try {
        await api.post("logout")
        return redirect("/login")
    } catch (error) {
        console.error("Logout failed: ", error)
    }
}

export const registerAction = async ({ request }: ActionFunctionArgs) => {
    const authStore = useAuthStore.getState()
    const formData = await request.formData()
    const credentials = Object.fromEntries(formData)

    try {
        const res = await authApi.post('register', credentials)

        if (res.status !== 200) {
            return {
                error: res.data || "Sending OTP failed."
            }
        }

        //? client state management
        authStore.setAuth(res.data.phone, res.data.token, Status.otp)

        return redirect("/register/otp")
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "Sending OTP failed." }
        } else {
            throw error
        }
    }
}

export const OTPAction = async ({ request }: ActionFunctionArgs) => {
    const authStore = useAuthStore.getState()
    const formData = await request.formData()

    const credentials = {
        phone: authStore.phone,
        token: authStore.token,
        otp: formData.get("otp")
    }

    try {
        const res = await authApi.post("verify-otp", credentials)

        if (res.status !== 200) {
            return {
                error: res.data || "OTP verification failed."
            }
        }

        authStore.setAuth(res.data.phone, res.data.token, Status.confirm)

        return redirect("/register/confirm-password")

    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "OTP verification failed." }
        } else {
            throw error
        }
    }
}

export const confirmPasswordAction = async ({ request }: ActionFunctionArgs) => {
    const authStore = useAuthStore.getState()
    const formData = await request.formData()

    const credentials = {
        phone: authStore.phone,
        token: authStore.token,
        password: formData.get("password")
    }

    try {
        const res = await authApi.post("confirm-password", credentials)
        if (res.status !== 201) {
            return {
                error: res.data || "Registration failed."
            }
        }

        authStore.clearAuth()

        return redirect("/")
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "Registration failed." }
        }
        throw error
    }
}

export const favoriteAction = async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData()

    if (!params.productId) {
        throw new Error("No Product ID provided.")
    }

    const data = {
        productId: params.productId,
        favorite: formData.get("favorite") === 'true'
    }

    try {
        const res = await api.patch("/user/products/toggle-favorite", data)

        if (res.status !== 200) {
            return {
                error: res.data || "Setting favorite failed."
            }
        }

        await queryClient.invalidateQueries({ queryKey: ['product', params.productId] })

        return null
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "Setting favorite failed." }
        }
        throw error
    }
}