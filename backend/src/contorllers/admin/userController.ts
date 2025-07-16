import { NextFunction, Request, Response } from "express"

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: 'Good' })
}