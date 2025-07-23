import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { checkUserIfNotExist, createHttpError } from "../../utils/auth";
import { errorCode } from "../../config/error-code";
import { checkUploadFile } from "../../utils/helpers";
import ImageQueue from "../../jobs/queues/image-queue";
import { getUserById } from "../../services/auth-service";
import { createOnePost, PostArgs } from "../../services/post-service";

interface CustomRequest extends Request {
    userId?: number
}

export const createPost = [
    body("title", "Title is required.").trim().notEmpty().escape(),
    body("content", "Content is required.").trim().notEmpty().escape(),
    body("body", "Body is required.").trim().notEmpty().escape(),
    body("category", "Category is required.").trim().notEmpty().escape(),
    body("type", "Type is required.").trim().notEmpty().escape(),
    body("tags", "Tag is invalid.").optional({ nullable: true }).customSanitizer((value) => {
        if (value) {
            return value.split(',').filter((tag: string) => tag.trim() !== '')
        }
        return value
    }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { title, content, body, category, type, tags } = req.body
        const userId = req.userId
        const image = req.file
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)
        checkUploadFile(image)

        const splitFileName = req.file?.filename.split('.')[0]

        await ImageQueue.add("optimize-image", {
            filePath: req.file!.path,
            fileName: `${splitFileName}.webp`,
            width: 835,
            height: 577,
            quality: 100
        }, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000
            }
        })

        const data: PostArgs = {
            title,
            content,
            body,
            image: req.file?.filename!,
            authorId: user?.id!,
            category,
            type,
            tags
        }

        const post = await createOnePost(data)

        res.status(201).json({
            message: "Create post successfully.",
            postId: post.id
        })
    }
]

export const updatePost = [
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

export const deletePost = [
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