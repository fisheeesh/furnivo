import api from '@/api'

export const homeLoader = async () => {
    try {
        const res = await api.get("/user/products")
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}