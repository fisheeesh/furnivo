import { Prisma, PrismaClient } from '../src/generated/prisma'
import * as bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// const userData: Prisma.UserCreateInput[] = [
//     {
//         phone: '3323242240',
//         password: "",
//         randToken: 'skf3fd32fjkejr3203'
//     },
//     {
//         phone: '3323242241',
//         password: "",
//         randToken: 'skf3fd32fjkejr3213'
//     },
//     {
//         phone: '3323242242',
//         password: "",
//         randToken: 'skf3fd32fjkejr3223'
//     },
//     {
//         phone: '3323242243',
//         password: "",
//         randToken: 'skf3fd32fjkejr3233'
//     },
//     {
//         phone: '3323242244',
//         password: "",
//         randToken: 'skf3fd32fjkejr3243'
//     },
// ]

function createRandomUser() {
    return {
        phone: faker.phone.number({ style: 'international' }),
        password: "",
        randToken: faker.internet.jwt()
    }
}

const userData = faker.helpers.multiple(createRandomUser, {
    count: 5,
});

async function main() {
    await prisma.user.deleteMany()

    console.log('Start seeding...')
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash('12345678', salt)

    for (const u of userData) {
        u.password = password
        await prisma.user.create({
            data: u
        })
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })