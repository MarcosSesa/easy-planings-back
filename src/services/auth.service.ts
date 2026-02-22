import {prismaService} from "src/services/prisma.service";


export const createUser = async (name: string, email: string, passwordHash: string) =>
    await prismaService.user.create({
        data: {name, email, passwordHash},
    });

export const findUser = async (email: string) => prismaService.user.findUnique({
    where: {email},
})
