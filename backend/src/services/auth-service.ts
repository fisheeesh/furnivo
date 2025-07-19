import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

export const getUserByPhone = async (phone: string) => {
    return await prisma.user.findUnique({
        where: { phone }
    })
}

export const getUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id }
    })
}

export const createUser = async (userData: any) => {
    return await prisma.user.create({
        data: userData
    })
}

export const updateUser = async (id: number, userData: any) => {
    return await prisma.user.update({
        where: { id },
        data: userData
    })
}

export const createOTP = async (otpData: any) => {
    return await prisma.otp.create({
        data: otpData
    })
}

export const getOTPByPhone = async (phone: string) => {
    return await prisma.otp.findUnique({
        where: { phone }
    })
}

export const updateOTP = async (id: number, otpData: any) => {
    return await prisma.otp.update({
        where: { id },
        data: otpData
    })
}