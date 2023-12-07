import {NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {authOptions} from '../../auth/[...nextauth]/route'
import {readSessionReplay} from '@/lib/core/analytic'

export async function GET(request: Request, {params}: {params: {sid: string}}) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id as string
    const assessmentQuizSubmissionId = params.sid
    const sessionReplay = await readSessionReplay({
      assessmentQuizSubId: assessmentQuizSubmissionId,
      userId,
    })

    return NextResponse.json({data: sessionReplay})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
