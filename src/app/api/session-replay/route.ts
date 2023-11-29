import {writeSessionReplay} from '@/lib/core/analytic'
import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const session = await getServerSession(authOptions)
    const userId = session?.user.id as string
    const {events, assessmentQuizSubId} = req

    await writeSessionReplay({data: events, userId, assessmentQuizSubId})

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
