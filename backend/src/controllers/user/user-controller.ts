import { NextFunction, Request, Response } from "express";
import { query, validationResult } from 'express-validator';
import { errorCode } from "../../config/error-code";
import { checkUserIfNotExist, createHttpError } from "../../utils/auth";
import { authorize } from "../../utils/authorize";
import { getUserById } from "../../services/auth-service";

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