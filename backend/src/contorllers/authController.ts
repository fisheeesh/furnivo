import { NextFunction, Request, Response } from 'express'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: 'register' })
}

export const verifyOtp = async (req: Request, res: Response) => {

}

export const confirmPassword = async (req: Request, res: Response) => {

}

export const login = async (req: Request, res: Response) => {

}
