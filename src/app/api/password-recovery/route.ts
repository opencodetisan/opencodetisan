import {NextResponse} from 'next/server'
import {initPassRecoveryService} from '@/lib/core/service'
import {Prisma} from '@prisma/client'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const email = req.username

    const result = await initPassRecoveryService({email, expiredInSeconds: 300})

    return NextResponse.json({})
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.log(error.message)
        return NextResponse.json({})
      }
    }
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
