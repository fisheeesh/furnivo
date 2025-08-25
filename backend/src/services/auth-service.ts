import { prisma } from "../config/prisma-client";
import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient()

export const getUserByPhone = async (phone: string) => {
    return await prismaClient.user.findUnique({
        where: { phone }
    })
}

export const getUserById = async (id: number) => {
    return await prismaClient.user.findUnique({
        where: { id }
    })
}

export const createUser = async (userData: any) => {
    return await prismaClient.user.create({
        data: userData
    })
}

export const updateUser = async (id: number, userData: any) => {
    return await prismaClient.user.update({
        where: { id },
        data: userData
    })
}

export const updateUserByPhone = async (phone: string, userData: any) => {
    return await prismaClient.user.update({
        where: { phone },
        data: userData
    })
}

export const createOTP = async (otpData: any) => {
    return await prismaClient.otp.create({
        data: otpData
    })
}

export const getOTPByPhone = async (phone: string) => {
    return await prismaClient.otp.findUnique({
        where: { phone }
    })
}

export const updateOTP = async (id: number, otpData: any) => {
    return await prismaClient.otp.update({
        where: { id },
        data: otpData
    })
}

export const getUserDataById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id }
    })
}