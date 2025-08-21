import { PrismaClient } from "../generated/prisma"
import { prisma } from "../config/prisma-client"

const prismaClient = new PrismaClient()

export const createOneProduct = async (data: any) => {
    let productData: any = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        inventory: data.inventory,
        category: {
            connectOrCreate: {
                where: { name: data.category },
                create: { name: data.category },
            }
        },
        type: {
            connectOrCreate: {
                where: { name: data.type },
                create: { name: data.type }
            }
        },
        images: {
            create: data.images
        }
    }


    if (data.tags && data.tags.length > 0) {
        productData.tags = {
            connectOrCreate: data.tags.map((tagName: string) => ({
                where: { name: tagName },
                create: { name: tagName }
            }))
        }
    }

    return await prisma.product.create({ data: productData })
}

export const getProductById = async (id: number) => {
    return await prismaClient.product.findUnique({
        where: { id },
        include: {
            images: true
        }
    })
}

export const getProductByIdWithRealtions = async (id: number) => {
    return await prisma.product.findUnique({
        where: { id },
        omit: {
            createdAt: true,
            updatedAt: true,
            categoryId: true,
            typeId: true
        },
        include: {
            images: { select: { id: true, path: true } },
        }
        // select: {
        //     id: true,
        //     name: true,
        //     description: true,
        //     price: true,
        //     discount: true,
        //     inventory: true,
        //     rating: true,
        //     status: true,
        //     images: { select: { path: true } },
        //     category: { select: { name: true } },
        //     type: { select: { name: true } },
        //     tags: { select: { name: true } }
        // }
    })
}

export const updateOneProduct = async (id: number, data: any) => {
    let productData: any = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        inventory: data.invetory,
        category: {
            connectOrCreate: {
                where: { name: data.category },
                create: { name: data.category }
            }
        },
        type: {
            connectOrCreate: {
                where: { name: data.type },
                create: { name: data.type }
            }
        },
    }

    if (data.images && data.images.length > 0) {
        productData.images = {
            deleteMany: {},
            create: data.images
        }
    }

    if (data.tags && data.tags.length > 0) {
        productData.tags = {
            set: [],
            connectOrCreate: data.tags.map((tagName: string) => ({
                where: { name: tagName },
                create: { name: tagName }
            }))
        }
    }

    return await prisma.product.update({
        where: { id },
        data: productData
    })
}

export const deleteOneProduct = async (id: number) => {
    return await prisma.product.delete({
        where: { id }
    })
}

export const getProductsList = async (options: any) => {
    return await prisma.product.findMany(options)
}

export const getAllCategories = async () => {
    return await prisma.category.findMany()
}

export const getAllTypes = async () => {
    return await prisma.type.findMany()
}