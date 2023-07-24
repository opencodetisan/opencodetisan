import {IcreateAssessmentProps} from '@/types'
import prisma from '../db/client'

export const createAssessment = async ({
  userId,
  title,
  description,
  quizIds,
}: IcreateAssessmentProps) => {
  if (!userId) {
    throw new Error('missing userId')
  } else if (!title) {
    throw new Error('missing title')
  } else if (!description) {
    throw new Error('missing description')
  } else if (!quizIds) {
    throw new Error('missing quizIds')
  }
  const assessment = await prisma.assessment.create({
    data: {
      ownerId: userId,
      title,
      description,
      assessmentQuizzes: {
        create: quizIds.map((q) => ({quizId: q})),
      },
    },
    include: {
      assessmentCandidateEmail: true,
      owner: {
        select: {
          adminContact: {
            select: {
              companyName: true,
            },
          },
        },
      },
    },
  })
  return assessment
}
