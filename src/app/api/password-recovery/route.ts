import {createUserToken, getUserByEmail} from '@/lib/core/user'
import prisma from '@/lib/db/client'
import {sendPassRecoveryMail} from '@/lib/nodemailer'
import {NextResponse} from 'next/server'
import {randomBytes, randomUUID} from 'node:crypto'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const email = req.username

    const user = await getUserByEmail({email})

    const token = randomUUID?.() ?? randomBytes(32).toString('hex')

    const userToken = await createUserToken({
      expiredAt: new Date(),
      token,
      email,
    })

    const result = await sendPassRecoveryMail({recipient: email, token})

    return NextResponse.json({})
  } catch (error) {}
}
