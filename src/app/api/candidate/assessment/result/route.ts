import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {createCandidateQuizAttempt} from '@/lib/core/candidate'
import {getCandidateAssessmentService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'

export async function POST(
  request: Request,
  {params}: {params: {aid: string}},
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id as string
    const {assessmentResultId} = await request.json()

    await createCandidateQuizAttempt({assessmentResultId})

    return NextResponse.json({data: {}})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
