import { NextFunction, Request, Response } from "express";
import { query, validationResult } from 'express-validator';
import { unlink } from "node:fs/promises";
import path from "path";
import sharp from "sharp";

import { errorCode } from "../../config/error-code";
import { getUserById, updateUser } from "../../services/auth-service";
import { checkUserIfNotExist, createHttpError } from "../../utils/auth";
import { authorize } from "../../utils/authorize";
import { checkUploadFile } from "../../utils/helpers";

interface CustomRequest extends Request {
    userId?: number;
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

    const fileName = Date.now() + '-' + `${Math.round(Math.random() * 1E9)}.webp`

    try {
        const optimizeImagePath = path.join(
            __dirname,
            '../../../',
            "uploads/images",
            fileName
        )
        await sharp(req.file?.buffer)
            .resize(200, 200)
            .webp({ quality: 50 })
            .toFile(optimizeImagePath)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Image optimization failed."
        })
        return
    }

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