import { Request, Response, NextFunction } from "express"
import { param, query, validationResult } from "express-validator"
import { checkModalIfExist, checkUserIfNotExist, createHttpError } from "../../utils/check"
import { errorCode } from "../../config/error-code"
import { getUserById } from "../../services/auth-service"
import { getProductByIdWithRealtions, getProductsList } from "../../services/product-service"
import { getOrSetCache } from "../../utils/cache"

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
        const product = await getOrSetCache(cacheKey, async () => await getProductByIdWithRealtions(+id))
        checkModalIfExist(product)

        res.status(200).json({
            message: "Here is Product Details.",
            product
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

        console.log(categoryList, typeList)

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

        const newCursor = products.length > 0 ? products[products.length - 1].id : null

        res.status(200).json({
            message: "Here is Product List.",
            hasNextPage,
            newCursor,
            products
        })
    }
]