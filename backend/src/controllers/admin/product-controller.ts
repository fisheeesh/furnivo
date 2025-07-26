import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { unlink } from "node:fs/promises";
import path from "path";
import { errorCode } from "../../config/error-code";
import CacheQueue from "../../jobs/queues/cache-queue";
import ImageQueue from "../../jobs/queues/image-queue";
import { createOneProduct, deleteOneProduct, getProductById, updateOneProduct } from "../../services/product-service";
import { checkModalIfExist, createHttpError } from "../../utils/check";
import { checkUploadFile } from "../../utils/helpers";
import { getPostById } from "../../services/post-service";

interface CustomRequest extends Request {
    userId?: number,
    user?: any,
    files?: any
}

const removeFiles = async (originalFiles: string[], optimizeFiles: string[] | null) => {
    try {
        for (const originalFile of originalFiles) {
            const originalFilePath = path.join(
                __dirname,
                '../../..',
                '/uploads/images',
                originalFile
            )
            await unlink(originalFilePath)
        }

        if (optimizeFiles) {
            for (const optimizeFile of optimizeFiles) {
                const optimizeFilePath = path.join(
                    __dirname,
                    '../../..',
                    '/uploads/optimize',
                    optimizeFile
                )
                await unlink(optimizeFilePath)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const createProduct = [
    body("name", "Name is required.").trim().notEmpty().escape(),
    body("description", "Description is required.").trim().notEmpty().escape(),
    body("price", "Price is required.")
        .isFloat({ min: 0.1 })
        .isDecimal({ decimal_digits: "1,2" }),
    body("discount", "Discount is required.").isFloat({ min: 0 }).isDecimal({ decimal_digits: "1, 2" }),
    body("inventory", "Inventory is required.").isInt({ min: 1 }),
    body("category", "Category is required.").trim().notEmpty().escape(),
    body("type", "Type is required.").trim().notEmpty().escape(),
    body("tags", "Invalid Tags.").optional({ nullable: true }).customSanitizer((value) => {
        if (value) {
            return value.split(',').filter((tag: string) => tag.trim() !== '')
        }
        return value
    }),

    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) {
            if (req.files && req.files.length > 0) {
                const originalFiles = req.files.map((file: any) => file.filename)
                await removeFiles(originalFiles, null)
            }
            return next(createHttpError({
                message: errors[0].msg,
                status: 400,
                code: errorCode.invalid
            }))
        }

        const { name, description, price, discount, inventory, category, type, tags } = req.body
        checkUploadFile(req.files && req.files.length > 0)

        await Promise.all(
            req.files.map(async (file: any) => {
                const splitFileName = file.filename.split(".")[0];
                return await ImageQueue.add(
                    "optimize-image",
                    {
                        filePath: file.path,
                        fileName: `${splitFileName}.webp`,
                        width: 835,
                        height: 577,
                        quality: 100,
                    },
                    {
                        attempts: 3,
                        backoff: {
                            type: "exponential",
                            delay: 1000,
                        },
                    }
                );
            })
        );

        const originalFileNames = req.files.map((file: any) => ({ path: file.filename }))

        const data: any = {
            name,
            description,
            price,
            discount,
            inventory: +inventory,
            category,
            type,
            tags,
            images: originalFileNames,
        }

        const product = await createOneProduct(data)

        await CacheQueue.add("invalidate-product-cache", {
            pattern: "products:*"
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(201).json({
            message: "Product created successfully.",
            productId: product.id
        })
    }
]
export const updateProduct = [
    body("productId", "ProductId is required.").isInt({ min: 1 }),
    body("name", "Name is required.").trim().notEmpty().escape(),
    body("description", "Description is required.").trim().notEmpty().escape(),
    body("price", "Price is required.")
        .isFloat({ min: 0.1 })
        .isDecimal({ decimal_digits: "1,2" }),
    body("discount", "Discount is required.").isFloat({ min: 0 }).isDecimal({ decimal_digits: "1, 2" }),
    body("inventory", "Inventory is required.").isInt({ min: 1 }),
    body("category", "Category is required.").trim().notEmpty().escape(),
    body("type", "Type is required.").trim().notEmpty().escape(),
    body("tags", "Invalid Tags.").optional({ nullable: true }).customSanitizer((value) => {
        if (value) {
            return value.split(',').filter((tag: string) => tag.trim() !== '')
        }
        return value
    }),

    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) {
            if (req.files && req.files.length > 0) {
                const originalFiles = req.files.map((file: any) => file.filename)
                await removeFiles(originalFiles, null)
            }
            return next(createHttpError({
                message: errors[0].msg,
                status: 400,
                code: errorCode.invalid
            }))
        }

        const { productId, name, description, price, discount, inventory, category, type, tags } = req.body

        const product = await getProductById(+productId)
        if (!product) {
            if (req.files && req.files.length > 0) {
                const originalFiles = req.files.map((file: any) => file.filename)
                await removeFiles(originalFiles, null)
            }
            return next(createHttpError({
                message: "Product not found.",
                status: 404,
                code: errorCode.invalid
            }))
        }

        let originalFileNames = []
        if (req.files && req.files.length > 0) {
            originalFileNames = req.files.map((file: any) => ({
                path: file.filename
            }))
        }

        const data: any = {
            name,
            description,
            price,
            discount,
            inventory: +inventory,
            category,
            type,
            tags,
            images: originalFileNames,
        }

        if (req.files && req.files.length > 0) {
            await Promise.all((
                req.files.map((file: any) => {
                    const splitFileName = file.filename.split('.')[0]

                    return ImageQueue.add('optimize-image', {
                        filePath: file.path,
                        fileName: `${splitFileName}.webp`,
                        width: 835,
                        height: 577,
                        quality: 100
                    }, {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 1000
                        }
                    })
                })
            ))

            //* deleting old images
            for (const image of product.images) {
                const optimizeFile = image.path.split('.')[0] + ".webp"
                await removeFiles([image.path], [optimizeFile])
            }
        }

        const updatedProduct = await updateOneProduct(product.id, data)

        await CacheQueue.add("invalidate-product-cache", {
            pattern: "products:*"
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(200).json({
            message: "Product updated successfully.",
            productId: updatedProduct.id
        })
    }
]
export const deleteProduct = [
    body("productId", "ProductId is required.").isInt({ min: 1 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { productId } = req.body
        const product = await getProductById(+productId)
        checkModalIfExist(product)

        for (const image of product!.images) {
            const optimizeFile = image.path.split('.')[0] + ".webp"
            await removeFiles([image.path], [optimizeFile])
        }

        const deletedProduct = await deleteOneProduct(product!.id)

        await CacheQueue.add("invalidate-product-cache", {
            pattern: "products:*"
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(200).json({
            message: "Product deleted successfully.",
            productId: deletedProduct.id
        })
    }
]

