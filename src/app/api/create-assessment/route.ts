import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'
import {
  acceptAssessmentService,
  addAssessmentCandidateService,
  createAssessmentService,
} from '@/lib/core/service'
import prisma from '@/lib/db/client'
import {sendAssessmentInvitation, sendUserCredential} from '@/lib/nodemailer'
import {faker} from '@faker-js/faker'
import bcrypt from 'bcrypt'
// TODO: code cleanup

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
