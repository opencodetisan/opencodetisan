import {getServerSession} from 'next-auth'
import {
  addAssessmentCandidateService,
  createAssessmentService,
} from '@/lib/core/service'
import {authOptions} from '../auth/[...nextauth]/route'
import {NextResponse} from 'next/server'
import {getManyAssessmentService} from '@/lib/core/service'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id!
  const assessments = await getManyAssessmentService({userId})

  return NextResponse.json(assessments)
}

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const {details, quizzes, candidates: candidateEmails} = req
    const session = await getServerSession(authOptions)
    const userId: string | undefined = session?.user.id as string
    const quizIds = Object.keys(quizzes).map((q) => q.split('/')[0])

    const assessment = await createAssessmentService({
      ...details,
      quizIds,
      userId,
    })

    const assessmentCandidate = await addAssessmentCandidateService({
      candidateEmails,
      assessmentId: assessment.id,
    })

    return NextResponse.json({})
  } catch (error) {
    console.log(error)
  }
}
