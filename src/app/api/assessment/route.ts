import {getServerSession} from 'next-auth'
import {
  addAssessmentCandidateService,
  createAssessmentService,
} from '@/lib/core/service'
import {authOptions} from '../auth/[...nextauth]/route'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const {details, quizzes, candidates: newCandidateEmails} = req
    const session = await getServerSession(authOptions)
    const userId: string | undefined = session?.user.id as string
    const quizIds = Object.keys(quizzes).map((q) => q.split('/')[0])

    // test with missing description
    const assessment = await createAssessmentService({
      ...details,
      quizIds,
      userId,
    })

    const assessmentCandidate = await addAssessmentCandidateService({
      newCandidateEmails,
      assessmentId: assessment.id,
    })

    return NextResponse.json({})
  } catch (error) {
    console.log(error)
  }
}
