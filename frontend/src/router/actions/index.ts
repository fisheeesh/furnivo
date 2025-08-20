import { redirect, type ActionFunctionArgs } from "react-router";
import api, { authApi } from "@/api";
import { AxiosError } from "axios";
import useAuthStore, { Status } from "@/store/authStore";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    // const authData = {
    //     phone: formData.get("phone"),
    //     password: formData.get("password")
    // }
    const credentials = Object.fromEntries(formData)

    try {
        const res = await authApi.post('login', credentials)
        console.log(res)
        if (res.status !== 200) {
            return {
                error: res.data || "Login failed. Please try again."
            }
        }
        // await fetch(import.meta.env.VITE_API_URL + "login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(credentials),
        //     credentials: "include"
        // })

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