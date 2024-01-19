import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {RUN} from '@/lib/constant'
import {updateCandidateSubmissionService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id as string
    const {quizId, code, assessmentQuizSubmissionId, action} =
      await request.json()

    const solutionResult = await updateCandidateSubmissionService({
      assessmentQuizSubmissionId,
      userId,
      code,
      quizId,
      action,
    })

    // TODO
    // @ts-ignore
    if (action === RUN || solutionResult.result === false || solutionResult.message) {
      return NextResponse.json(solutionResult)
    } 

    return NextResponse.json({
      // TODO
      // @ts-ignore
      assessmentId: solutionResult.assessmentResult?.assessmentId,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
