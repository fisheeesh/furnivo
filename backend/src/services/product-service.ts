import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

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
    return await prisma.product.findUnique({
        where: { id },
        include: {
            images: true
        }
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