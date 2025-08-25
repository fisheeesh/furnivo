import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from "express";
import { body, query, validationResult } from 'express-validator';
import { unlink } from "node:fs/promises";
import path from "path";

import { errorCode } from "../../config/error-code";
import ImageQueue from "../../jobs/queues/image-queue";
import { getUserById, getUserDataById, updateUser, updateUserById } from "../../services/auth-service";
import { authorize } from "../../utils/authorize";
import { checkUserIfNotExist, createHttpError } from "../../utils/check";
import { checkUploadFile } from "../../utils/helpers";

interface CustomRequest extends Request {
    userId?: number;
}

const removeFiles = async (originalFile: string, optimizeFile?: string | null) => {
    try {
        const originalFilePath = path.join(
            __dirname,
            "../../../",
            "/uploads/images",
            originalFile
        )
        await unlink(originalFilePath)

        if (optimizeFile) {
            const optimizeFilePath = path.join(__dirname, "../../../", '/uploads/optimize', optimizeFile)
            await unlink(optimizeFilePath)
        }
    } catch (error) {
        console.log(error)
    }
}

export const changeLanguage = [
    query("lng", "Invalid language code.")
        .trim()
        .notEmpty()
        .matches(/^[a-z]+$/)
        .isLength({ min: 2, max: 3 })
    ,
    (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCode.invalid
        }))

        const { lng } = req.query

        res.cookie("i18next", lng)
        res.status(200).json({ message: req.t("changeLng", { lang: lng }) })
    }
]

export const testPermission = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId
    const user = await getUserById(userId!)
    checkUserIfNotExist(user)

    const info: any = {
        title: 'Testing Permission'
    }
    //* If user.rolw === "AUTHOR"
    //* content = "You are an author"
    const can = authorize(true, user!.role, "AUTHOR")
    if (can) {
        info.content = "You have permission to access this route"
    }

    res.status(200).json({ info })
}

export const uploadProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId
    const image = req.file
    const user = await getUserById(userId!)

    checkUserIfNotExist(user)
    checkUploadFile(image)

    const fileName = image!.filename

    if (user?.image) {
        try {
            const filePath = path.join(__dirname, '../../../', '/uploads/images', user!.image)
            await unlink(filePath)
        } catch (error) {
            console.log(error)
        }
    }

    const userData = {
        image: fileName
    }

    await updateUser(user!.id, userData)

    res.status(200).json({
        message: "Upload profile successfully.",
        image: fileName
    })
}

export const uploadProfileMultiple = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId
    const images = req.files
    const user = await getUserById(userId!)
    checkUserIfNotExist(user)

    console.log(images)

    res.status(200).json({
        message: "Multiple Upload profile successfully.",
    })
}

export const uploadProfileOptimize = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId
    const image = req.file
    const user = await getUserById(userId!)

    checkUserIfNotExist(user)
    checkUploadFile(image)

    //* make file name unique and set extension
    const splitFileName = req.file?.filename.split('.')[0]

    const job = await ImageQueue.add("optimize-image", {
        filePath: req.file!.path,
        fileName: `${splitFileName}.webp`,
        width: 200,
        height: 200,
        quality: 50
    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        }
    })

    if (user?.image) {
        try {
            const originalFilePath = path.join(__dirname, '../../../', '/uploads/images', user!.image)
            const optimizeFilePath = path.join(__dirname, '../../../', '/uploads/optimize', user!.image.split('.')[0] + ".webp")
            await unlink(originalFilePath)
            await unlink(optimizeFilePath)
        } catch (error) {
            console.log(error)
        }
    }

    const userData = {
        image: req.file?.filename
    }

    await updateUser(user!.id, userData)

    res.status(200).json({
        message: "Upload profile successfully.",
        image: splitFileName + '.webp',
        jobId: job.id
    })
}

//* for testing
export const getMyPhoto = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const file = path.join(
        __dirname,
        '../../../',
        '/uploads/images',
        "1753178375515-484754777-ken.jpg"
    )

    res.sendFile(file, (err) => {
        res.status(404).send("File not found")
    })
}

export const getUserData = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId
    const user = await getUserById(userId!)

    checkUserIfNotExist(user)

    const userData = await getUserDataById(user!.id)

    res.status(200).json({
        message: "Get user data successfully.",
        user: userData,
    })
}

export const updateProfile = [
    body("email", "Invalid eamil format.").trim().notEmpty().escape(),
    body("firstName", "First name is required.").trim().notEmpty().escape(),
    body("lastName", "Last name is required.").trim().notEmpty().escape(),
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

        const { email, firstName, lastName } = req.body
        const userId = req.userId

        const user = await getUserById(userId!)
        if (!user) {
            if (req.file) {
                await removeFiles(req.file.filename, null)
            }

            return next(createHttpError({
                message: 'User not found.',
                status: 401,
                code: errorCode.invalid
            }))
        }

        const data: any = {
            email,
            firstName,
            lastName,
        }

        if (req.file) {
            data.image = req.file.filename

            const splitFileName = req.file.filename.split(".")[0]
            await ImageQueue.add("optimize-image", {
                filePath: req.file.path,
                fileName: splitFileName + ".webp",
                width: 200,
                height: 200,
                quality: 80
            }, {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000
                }
            })

            await removeFiles(user.image!, user!.image?.split(".")[0] + ".webp")
        }

        const updatedUser = await updateUserById(userId!, data)

        res.status(200).json({
            message: "Update profile successfully.",
            user: updatedUser
        })
    }
]

export const changePassword = [
    body("oldPassword", "Password must be at least 8 digits.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 8, max: 8 }),
    body("newPassword", "Password must be at least 8 digits.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 8, max: 8 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) {
            return next(createHttpError({
                message: errors[0].msg,
                status: 400,
                code: errorCode.invalid
            }))
        }

        const { oldPassword, newPassword } = req.body
        const userId = req.userId

        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const isMatchOldPassword = await bcrypt.compare(oldPassword, user!.password)

        if (!isMatchOldPassword) return next(createHttpError({
            message: "To change your password, you have to enter your old password correctly.",
            status: 400,
            code: errorCode.invalid
        }))

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        const userData = {
            password: hashPassword
        }

        await updateUser(user!.id, userData)

        res.status(200).json({
            message: "Your password is successfully changed.",
            userId: user!.id
        })
    }
]

