import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: any) {
    try {
        
        const {from, host, port, secure, username, password } = await request.json();
        const newSetting = await prisma.mailSetting.upsert({
            where: {
                username: username,
            },
            update: {
                from,
                host,
                port,
                secure,
                username,
                password,
            },
            create: {
                from,
                host,
                port,
                secure,
                username,
                password,
            },
        })
        
        const allSettings = await prisma.mailSetting.findMany();
        return ({ newSetting, allSettings });
    } catch (error) {
        console.error(error);
        return ({ error: 'Failed saving settings' });
    }
}

