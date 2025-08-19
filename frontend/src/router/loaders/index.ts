import api, { authApi } from '@/api'
import { redirect } from 'react-router'

export const homeLoader = async () => {
    try {
        const res = await api.get("/user/products")
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
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