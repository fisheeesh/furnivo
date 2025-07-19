import { NextFunction, Request, Response } from "express";
import { query, validationResult } from 'express-validator';
import { createHttpError } from "../../utils/auth";
import { errorCode } from "../../config/error-code";

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