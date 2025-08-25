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

        //* Get redirect parameter from current page URL, not form submission URL
        const urlParams = new URLSearchParams(window.location.search)
        const redirectTo = urlParams.get("redirect") || "/"
        return redirect(redirectTo)
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "login Failed" }
        }
        throw error
    }
}

// export const logoutAction = async () => {
//     try {
//         await authApi.post("logout")
//         queryClient.removeQueries()
//         return redirect("/login")
//     } catch (error) {
//         console.error("Logout failed: ", error)
//     }
// }

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

export const favoriteAction = async ({
    request,
    params,
}: ActionFunctionArgs) => {
    const formData = await request.formData();
    if (!params.productId) {
        throw new Error("No Product ID provided");
    }

    const data = {
        productId: Number(params.productId),
        favorite: formData.get("favorite") === "true",
    };

    try {
        const response = await api.patch("/user/products/toggle-favorite", data);
        if (response.status !== 200) {
            return { error: response.data || "Setting favourite Failed!" };
        }

        await queryClient.invalidateQueries({
            queryKey: ["products", "detail", params.productId],
        });

        return null;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "Setting favourite failed!" };
        } else throw error;
    }
};

export const forgetPasswordAction = async ({ request }: ActionFunctionArgs) => {
    const authStore = useAuthStore.getState()
    const formData = await request.formData()
    const credentials = Object.fromEntries(formData)

    try {
        const res = await authApi.post("forget-password", credentials)

        if (res.status !== 200) {
            return {
                error: res.data || "Sending OTP Failed. Please Try again."
            }
        }

        authStore.setAuth(res.data.phone, res.data.token, Status.verify)
        return redirect("/forgot-password/verify-otp")
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "Sending OTP Failed." }
        } else throw error
    }
}

export const verifyOTPAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const authStore = useAuthStore.getState()

    const data = {
        phone: authStore.phone,
        otp: formData.get("otp"),
        token: authStore.token
    }

    try {
        const res = await authApi.post("verify", data)

        if (res.status !== 200) {
            return {
                error: res.data || "Verifying OTP Failed."
            }
        }

        authStore.setAuth(res.data.phone, res.data.token, Status.reset)
        return redirect("/forgot-password/reset-password")
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "Verifying OTP Failed." }
        }
        throw error
    }
}

export const resetPasswordAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const authStore = useAuthStore.getState()

    const data = {
        phone: authStore.phone,
        password: formData.get("password"),
        token: authStore.token
    }

    try {
        const res = await authApi.post("reset-password", data)

        if (res.status !== 200) {
            return {
                error: res.data || "Verifying OTP Failed."
            }
        }

        authStore.clearAuth()
        return redirect("/")
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || { error: "Verifying OTP Failed." }
        }
        throw error
    }
}