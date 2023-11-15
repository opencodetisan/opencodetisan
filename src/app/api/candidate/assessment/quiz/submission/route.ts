import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {updateCandidateSubmissionService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id as string
    const {quizId, code, assessmentQuizSubmissionId} = await request.json()

    const result = await updateCandidateSubmissionService({
      assessmentQuizSubmissionId,
      userId,
      code,
      quizId,
    })

    return NextResponse.json({
      assessmentId: result.assessmentResult?.assessmentId,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
