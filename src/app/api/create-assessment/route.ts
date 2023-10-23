import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'
import {
  acceptAssessmentService,
  createAssessmentService,
} from '@/lib/core/service'
import prisma from '@/lib/db/client'
import {sendAssessmentInvitation, sendUserCredential} from '@/lib/nodemailer'
import {faker} from '@faker-js/faker'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const {details, quizzes, candidates} = req
    const session = await getServerSession(authOptions)
    const userId: string | undefined = session?.user.id as string
    const quizIds = Object.keys(quizzes).map((q) => q.split('/')[0])

    // test with missing description
    const assessment = await createAssessmentService({
      ...details,
      quizIds,
      userId,
    })

    // TODO: use service function
    const userPromises = []
    const existingCandidatesObj: {[key: string]: {email: string; id: string}} =
      {}
    const existingCandidates = await prisma.user.findMany({
      where: {
        email: {
          in: candidates,
        },
      },
      select: {
        email: true,
        id: true,
      },
    })

    existingCandidates.forEach((c) => (existingCandidatesObj[c.email] = c))

    for (let i = 0; i < candidates.length; i++) {
      const email = candidates[i]

      if (existingCandidatesObj[email]) {
        const candidateId = existingCandidatesObj[email].id
        await acceptAssessmentService({
          assessmentId: assessment.id,
          userId: candidateId,
          token: email + faker.lorem.text(),
        })
        await sendAssessmentInvitation({recipient: email, aid: assessment.id})
      } else {
        const name = email.split('@')[0]
        const password = faker.lorem.word({strategy: 'longest'})
        const hashedPassword = await bcrypt.hash(password, 10)
        const newCandidate = await prisma.user.create({
          data: {
            email: email,
            name,
            userKey: {
              create: {
                password: hashedPassword,
              },
            },
          },
        })
        await acceptAssessmentService({
          assessmentId: assessment.id,
          userId: newCandidate.id,
          token: email,
        })
        await sendAssessmentInvitation({recipient: email, aid: assessment.id})
        await sendUserCredential({recipient: email, password})
      }
    }

    return NextResponse.json({})
  } catch (error) {
    console.log(error)
  }
}
