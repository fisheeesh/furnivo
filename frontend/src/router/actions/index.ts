import { redirect, type ActionFunctionArgs } from "react-router";
import { authApi } from "@/api";
import { AxiosError } from "axios";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const authData = {
        phone: formData.get("phone"),
        password: formData.get("password")
    }

    try {
        const res = await authApi.post('login', authData)
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