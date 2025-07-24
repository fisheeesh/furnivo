import { NextFunction, Request, Response } from "express"
import { body, param, validationResult } from "express-validator"
import { errorCode } from "../../config/error-code"
import { checkModalIfExist, checkUserIfNotExist, createHttpError } from "../../utils/check"
import { getUserById } from "../../services/auth-service"
import { getPostById, getPostByIdWithRealtions } from "../../services/post-service"

interface CustomRequest extends Request {
    userId?: number
}

export const getPost = [
    param("id", "PostId is required").isInt({ gt: 0 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const postId = req.params.id
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const post = await getPostByIdWithRealtions(+postId)
        checkModalIfExist(post)
        // const modifiedPost = {
        //     id: post!.id,
        //     title: post!.title,
        //     content: post!.content,
        //     body: post!.body,
        //     image: "/optimize/" + post!.image.split('.')[0] + ".webp",
        //     updatedAt: post!.updatedAt.toLocaleDateString("en-US", {
        //         year: "numeric", month: "long", day: "numeric"
        //     }),
        //     fullName: (post!.author.firstName ?? "") + " " + (post?.author.lastName ?? ""),
        //     category: post!.category.name,
        //     type: post!.type.name,
        //     tags: post!.tags && post!.tags.length > 0 ? post!.tags.map(tag => tag.name) : null
        // }

        res.status(200).json({
            message: "Here is Post Detail.",
            post: post
        })
    }
]

export const getPostsByPagination = [
    body(""),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))


        res.status(200).json({
            message: "Create post successfully."
        })
    }
]

export const getInfinitePostsByPagination = [
    body(""),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))


        res.status(200).json({
            message: "Create post successfully."
        })
    }
]