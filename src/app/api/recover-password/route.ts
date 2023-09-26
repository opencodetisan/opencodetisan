import {NextResponse} from 'next/server'
import {Prisma} from '@prisma/client'
import {recoverPasswordService} from '@/lib/core/service'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const token = req.token
    const password = req.password

    const result = await recoverPasswordService({token, password})

    return NextResponse.json({})
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.log(error.message)
      }
    }
    return NextResponse.json({})
  }
}
