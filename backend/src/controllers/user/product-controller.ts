import { Request, Response, NextFunction } from "express"
import { param, validationResult } from "express-validator"
import { checkModalIfExist, checkUserIfNotExist, createHttpError } from "../../utils/check"
import { errorCode } from "../../config/error-code"
import { getUserById } from "../../services/auth-service"
import { getProductByIdWithRealtions } from "../../services/product-service"
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