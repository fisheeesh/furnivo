import { NextFunction, Request, Response } from "express"
import { body, param, query, validationResult } from "express-validator"
import { errorCode } from "../../config/error-code"
import { getUserById } from "../../services/auth-service"
import { getAllCategories, getAllTypes, getProductById, getProductByIdWithRealtions, getProductsList } from "../../services/product-service"
import { addProductToFavorite, removeProductFromFavorite } from "../../services/user-service"
import { getOrSetCache } from "../../utils/cache"
import { checkModalIfExist, checkUserIfNotExist, createHttpError } from "../../utils/check"
import CacheQueue from "../../jobs/queues/cache-queue"

interface CustomRequest extends Request {
    userId?: number
}

export const getProduct = [
    param("id", "ProdcutId is required.").isInt({ min: 1 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { id } = req.params
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const cacheKey = `product:${JSON.stringify(id)}`
        const product = await getOrSetCache(cacheKey, async () => await getProductByIdWithRealtions(+id, userId!))
        checkModalIfExist(product)

        res.status(200).json({
            message: "Here is Product Details.",
            product
        })
    }
]

export const getProductsListByOffset = [
    query("page", "Page must be unsigned integer.").isInt({ gt: 0 }),
    query("limit", "Limit must be unsigned integer.").isInt({ gt: 4 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { page = 1, limit = 5 } = req.query
        const skip = +page - 1 * +limit
        const take = +limit + 1

        const options = {
            skip,
            take,
            select: {
                id: true,
                name: true,
                price: true,
                discount: true,
                status: true,
                image: { select: { id: true, path: true }, take: 1 }
            },
            orderBy: {
                updatedAt: "desc"
            }
        }

        // const products = await getProductsList(options)
        const cacheKey = `products:${JSON.stringify(req.query)}`
        const products = await getOrSetCache(cacheKey, async () => await getProductsList(options))
        const hasNextPage = products.length > +limit
        let nextPage = null

        const previousPage = +page !== 1 ? +page - 1 : null

        if (hasNextPage) {
            products.pop()
            nextPage = +page + 1
        }

        res.status(200).json({
            message: "Here is Product List.",
            products: products,
            hasNextPage,
            nextPage,
            previousPage
        })
    }
]

export const getProductsByPagination = [
    query("cursor", "Cursor must be ProductId.").isInt({ gt: 0 }).optional(),
    query("limit", "Limit number must be unsigned integer.").isInt({ gt: 4 }).optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { cursor: lastCursor, limit = 5 } = req.query
        const category = req.query.category
        const type = req.query.type

        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        let categoryList: number[] = []
        let typeList: number[] = []

        if (category) {
            categoryList = category.toString().split(',').map(c => Number(c)).filter(c => c > 0)
        }

        if (type) {
            typeList = type.toString().split(',').map(t => Number(t)).filter(t => t > 0)
        }

        const where = {
            AND: [
                categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
                typeList.length > 0 ? { typeId: { in: typeList } } : {}
            ]
        }

        const options = {
            where,
            skip: lastCursor ? 1 : 0,
            take: +limit + 1,
            cursor: lastCursor ? { id: +lastCursor } : undefined,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                discount: true,
                status: true,
                images: { select: { id: true, path: true }, take: 1 },
            },
            orderBy: {
                id: "desc"
            }
        }

        const cacheKey = `products:${JSON.stringify(req.query)}`
        const products = await getOrSetCache(cacheKey, async () => await getProductsList(options))
        const hasNextPage = products.length > +limit

        if (hasNextPage) {
            products.pop()
        }

        const nextCursor = products.length > 0 ? products[products.length - 1].id : null

        res.status(200).json({
            message: "Here is Product List.",
            hasNextPage,
            nextCursor,
            prevCursor: lastCursor,
            products
        })
    }
]

export const getAllCategoriesAndTypes = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const allCategories = await getAllCategories()
    const allTypes = await getAllTypes()

    res.status(200).json({
        categories: allCategories,
        types: allTypes
    })
}

export const toggleFavorites = [
    body("productId", "Product ID is required.").isInt({ gt: 0 }),
    body("favorite", "Favorite must be boolean.").isBoolean(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { productId, favorite } = req.body
        const userId = req.userId

        const user = await getUserById(userId!)

        const product = await getProductById(+productId)
        checkModalIfExist(product)

        if (favorite) {
            await addProductToFavorite(user!.id, product!.id)
        } else {
            await removeProductFromFavorite(user!.id, product!.id)
        }

        await CacheQueue.add("invalidate-product-cache", {
            pattern: "products:*"
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(200).json({
            message: favorite ? "Successfully added to favorite." : "Successfully removed from favorite."
        })
    }
]