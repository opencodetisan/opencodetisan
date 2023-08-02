import {
  ICreateCandidateQuizSubmissionProps,
  IGetActivityLogsProps,
} from '@/types'
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

export const getActivityLogCount = async ({
  assessmentIds,
}: {
  assessmentIds: string[]
}) => {
  if (!assessmentIds) {
    throw Error('missing assessmentIds')
  } else if (assessmentIds.length === 0) {
    throw Error('empty assessmentIds')
  }
  try {
    const activityLogCount = await prisma.candidateActivityLog.count({
      where: {
        assessmentId: {
          in: assessmentIds,
        },
      },
    })
    return activityLogCount
  } catch (e) {
    console.log(e)
  }
}

export const getActivityLogs = async ({
  assessmentIds,
  amount,
  skip,
}: IGetActivityLogsProps) => {
  if (!assessmentIds) {
    throw Error('missing assessmentIds')
  } else if (assessmentIds.length === 0) {
    throw Error('empty assessmentIds')
  }
  try {
    const activityLogData = await prisma.candidateActivityLog.findMany({
      where: {
        assessmentId: {
          in: assessmentIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take: amount,
    })

    return activityLogData
  } catch (e) {
    console.log(e)
  }
}
