import { NextFunction, Request, Response } from "express"
import { param, query, validationResult } from "express-validator"
import { errorCode } from "../../config/error-code"
import { getUserById } from "../../services/auth-service"
import { getPostByIdWithRealtions, getPostsList } from "../../services/post-service"
import { checkModalIfExist, checkUserIfNotExist, createHttpError } from "../../utils/check"
import { getOrSetCache } from "../../utils/cache"

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

        // const post = await getPostByIdWithRealtions(+postId)
        const cacheKey = `post:${JSON.stringify(postId)}`
        const post = await getOrSetCache(cacheKey, async () => await getPostByIdWithRealtions(+postId))
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

//* Offset Pagination
export const getPostsByPagination = [
    query("page", "Page number must be unsigned integer.").isInt({ gt: 0 }).optional(),
    query("limit", "Limit number must be unsigned integer.").isInt({ gt: 4 }).optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { page = 1, limit = 5 } = req.query
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const skip = (+page - 1) * +limit
        const take = +limit + 1

        const options = {
            skip,
            take,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                updatedAt: true,
                author: { select: { fullName: true } }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        }

        // const posts = await getPostsList(options)
        const cacheKey = `posts:${JSON.stringify(req.query)}`
        const posts = await getOrSetCache(cacheKey, async () => await getPostsList(options))

        const hasNextPage = posts.length > +limit
        let nextPage = null
        const previousPage = +page !== 1 ? +page - 1 : null

        if (hasNextPage) {
            posts.pop()
            nextPage = +page + 1
        }

        res.status(200).json({
            message: "Get All Posts",
            currentPage: page,
            hasNextPage,
            nextPage,
            previousPage,
            posts,
        })
    }
]

export const getInfinitePostsByPagination = [
    query("cursor", "Cursor must be PostId.").isInt({ gt: 0 }).optional(),
    query("limit", "Limit number must be unsigned integer.").isInt({ gt: 4 }).optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { cursor: lastCursor, limit = 5 } = req.query
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const options = {
            take: +limit + 1,
            skip: lastCursor ? 1 : 0,
            cursor: lastCursor ? { id: +lastCursor } : undefined,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                updatedAt: true,
                author: { select: { fullName: true } }
            },
            orderBy: {
                id: 'asc'
            }
        }

        // const posts = await getPostsList(options)
        const cacheKey = `posts:${JSON.stringify(req.query)}`
        const posts = await getOrSetCache(
            cacheKey,
            async () => await getPostsList(options)
        )
        const hasNextPage = posts.length > +limit

        if (hasNextPage) {
            posts.pop()
        }

        const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null

        res.status(200).json({
            message: "Get all infinite posts.",
            hasNextPage,
            newCursor,
            posts
        })
    }
]