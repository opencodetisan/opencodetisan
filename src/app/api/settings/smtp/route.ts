import { NextResponse } from 'next/server'
import Cryptr from 'cryptr';
import prisma from '@/lib/db/client';

export async function POST(request: any) {
    try {
        const { from, host, port, secure, username, password } = await request.json()
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
        console.error(error)
        return NextResponse.json({ error: 'Failed saving settings' })
    }
}

let smtpDetails: any
export async function GET() {
    try {
      smtpDetails = await prisma.mailSetting.findFirst()
      return NextResponse.json(smtpDetails)
    } catch (error) {
      console.error('Error retrieving SMTP details:', error)
      return NextResponse.json({ error: 'Failed reading settings' })
    }
}