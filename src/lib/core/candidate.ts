import {ICreateCandidateQuizSubmissionProps} from '@/types'
import prisma from '../db/client'

export const createCandidateQuizSubmission = async ({
  userId,
  quizId,
  code,
}: ICreateCandidateQuizSubmissionProps) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!quizId) {
    throw Error('missing quizId')
  } else if (!code) {
    throw Error('missing code')
  }
  const submission = await prisma.submission.create({
    data: {
      userId,
      quizId,
      code,
    },
  })
  return submission
}
