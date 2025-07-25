import { redis } from "../config/redis-client";

/**
 * 
 * * @param key for retrieve
 * * @param cb for store
 */
export const getOrSetCache = async (key: any, cb: any) => {
    try {
        //* Check if there is cachedData in redis with key
        const cachedData = await redis.get(key)
        if (cachedData) {
            console.log('Cache hit')
            //* If it is, return it
            return JSON.parse(cachedData)
        }

        console.log('Cache miss')
        //* If not, go and grab data from db
        const freshData = await cb()
        //* And store it in redis
        await redis.setex(key, 3600, JSON.stringify(freshData))
        return freshData
    } catch (error) {
        console.log(error)
        throw error
    }
}