import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import Cryptr from 'cryptr';

const prisma = new PrismaClient()

export async function POST(request: any) {
    try {

        const { from, host, port, secure, username, password } = await request.json();
        const cryptr = new Cryptr(password)
        const encryptedPassword = cryptr.encrypt(password)
        const newSetting = await prisma.mailSetting.upsert({
            where: {
                id: 1,
            },
            update: {
                from,
                host,
                port,
                secure,
                username,
                password: encryptedPassword,
            },
            create: {
                from,
                host,
                port,
                secure,
                username,
                password: encryptedPassword,
            },
        })
        return NextResponse.json(newSetting)
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed saving settings' })

    }
}

