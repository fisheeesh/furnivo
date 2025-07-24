import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { checkModalIfExist, checkUserIfNotExist, createHttpError } from "../../utils/check";
import { errorCode } from "../../config/error-code";
import { checkUploadFile } from "../../utils/helpers";
import ImageQueue from "../../jobs/queues/image-queue";
import { getUserById } from "../../services/auth-service";
import { createOnePost, deleteOnePost, getPostById, PostArgs, updateOnePost } from "../../services/post-service";

import sanitizeHtml from 'sanitize-html';
import { unlink } from "node:fs/promises";
import path from "path";

interface CustomRequest extends Request {
    userId?: number
}

const removeFiles = async (originalFile: string, optimizedFile?: string | null) => {
    try {
        const originalFilePath = path.join(__dirname, '../../../', '/uploads/images', originalFile)
        await unlink(originalFilePath)

        if (optimizedFile) {
            const optimizeFilePath = path.join(__dirname, '../../../', '/uploads/optimize', optimizedFile)
            await unlink(optimizeFilePath)
        }
    } catch (error) {
        console.log(error)
    }
}

export const createPost = [
    body("title", "Title is required.").trim().notEmpty().escape(),
    body("content", "Content is required.").trim().notEmpty(),
    body("body", "Body is required.")
        .trim()
        .notEmpty()
        .customSanitizer(value => sanitizeHtml(value)).notEmpty(),
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
        if (errors.length > 0) {
            if (req.file) {
                await removeFiles(req.file.filename, null)
            }
            return next(createHttpError({
                message: errors[0].msg,
                status: 400,
                code: errorCode.invalid
            }))
        }

        const { title, content, body, category, type, tags } = req.body
        const userId = req.userId
        const image = req.file
        checkUploadFile(image)
        const user = await getUserById(userId!)
        if (!user) {
            if (req.file) {
                await removeFiles(req.file.filename, null)
            }
            return next(createHttpError({
                message: 'This phone has not been registered.',
                status: 401,
                code: errorCode.unauthenticated
            }))
        }

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
    body("postId", "PostId is required.").trim().notEmpty().isInt({ min: 1 }),
    body("title", "Title is required.").trim().notEmpty().escape(),
    body("content", "Content is required.").trim().notEmpty(),
    body("body", "Body is required.")
        .trim()
        .notEmpty()
        .customSanitizer(value => sanitizeHtml(value)).notEmpty(),
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
        if (errors.length > 0) {
            if (req.file) {
                await removeFiles(req.file.filename, null)
            }
            return next(createHttpError({
                message: errors[0].msg,
                status: 400,
                code: errorCode.invalid
            }))
        }

        const { postId, title, content, body, category, type, tags } = req.body
        const userId = req.userId
        const user = await getUserById(userId!)
        if (!user) {
            if (req.file) {
                await removeFiles(req.file.filename, null)
            }
            return next(createHttpError({
                message: 'This phone has not been registered.',
                status: 401,
                code: errorCode.unauthenticated
            }))
        }

        const post = await getPostById(+postId)
        if (!post) {
            if (req.file) {
                await removeFiles(req.file.filename, null)
            }

            return next(createHttpError({
                message: 'Post not found.',
                status: 401,
                code: errorCode.invalid
            }))
        }

        if (user.id !== post.authorId) {
            if (req.file) {
                await removeFiles(req.file.filename, null)
            }

            return next(createHttpError({
                message: 'You are not allowed to update this post.',
                status: 403,
                code: errorCode.unauthorized
            }))
        }

        const data: any = {
            title,
            content,
            body,
            image: req.file,
            category,
            type,
            tags
        }

        if (req.file) {
            data.image = req.file.filename
            const splitFileName = req.file.filename.split('.')[0]

            await ImageQueue.add("optimize-image", {
                filePath: req.file.path,
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

            const optmizedFile = post.image.split('.')[0] + '.webp'
            await removeFiles(post.image, optmizedFile)
        }

        const updatedPost = await updateOnePost(post.id, data)


        res.status(200).json({
            message: "Successfully updated the post.",
            postId: updatedPost.id
        })
    }
]

export const deletePost = [
    body("postId", "PostId is required.").trim().notEmpty().isInt({ min: 1 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { postId } = req.body
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)
        const post = await getPostById(+postId)
        checkModalIfExist(post)

        if (post!.authorId !== userId) return next(createHttpError({
            message: "You are not allowed to delete this post.",
            status: 403,
            code: errorCode.unauthorized
        }))

        const deletedPost = await deleteOnePost(post!.id)

        const optimzedFile = post!.image.split('.')[0] + '.webp'
        await removeFiles(post!.image, optimzedFile)

        res.status(200).json({
            message: "Successfully deleted the post.",
            postId: deletedPost.id
        })
    }
]