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

export const createCandidateQuizAttempt = async ({
  assessmentResultId,
}: {
  assessmentResultId: string
}) => {
  if (!assessmentResultId) {
    throw Error('missing assessmentResultId')
  }
  const assessmentResult = await prisma.assessmentResult.update({
    where: {
      id: assessmentResultId,
    },
    data: {
      status: 'STARTED',
      assessmentQuizSubmissions: {
        create: {
          start: new Date(),
        },
      },
    },
    include: {
      assessmentQuizSubmissions: true,
    },
  })
  return assessmentResult
}

export const getCandidateAssessment = async ({
  assessmentId,
  candidateId,
}: {
  assessmentId: string
  candidateId: string
}) => {
  const assessmentCandidate = await prisma.assessmentCandidate.findUnique({
    where: {
      assessmentId_candidateId: {
        candidateId,
        assessmentId,
      },
    },
    include: {
      assessment: {
        include: {
          owner: {
            select: {
              name: true,
            },
          },
          assessmentResults: {
            where: {
              candidateId,
            },
            include: {
              assessmentQuizSubmissions: {
                where: {
                  submissionId: {
                    not: null,
                  },
                },
                include: {
                  submission: {
                    select: {
                      code: true,
                    },
                  },
                },
                orderBy: {
                  start: 'desc',
                },
                take: 1,
              },
              quiz: true,
            },
          },
        },
      },
    },
  })

  if (!assessmentCandidate) {
    return null
  }
  const assessment = assessmentCandidate.assessment
  const codingQuizzes = assessmentCandidate.assessment.assessmentResults

  const data: Record<string, string | Date | number> = {}

  for (const key in assessmentCandidate?.assessment) {
    if (!key.startsWith('assessmentResults')) {
      data[key] = assessment[key]
    }
  }

  return {assessment, codingQuizzes}
}

export const getCandidateResult = async ({
  assessmentId,
  quizId,
  userId,
}: {
  assessmentId: string
  quizId: string
  userId: string
}) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!quizId) {
    throw Error('missing quizId')
  } else if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      assessmentResults: {
        where: {
          assessmentId,
          quizId,
          candidateId: userId,
        },
        include: {
          assessmentQuizSubmissions: {
            orderBy: {
              start: 'desc',
            },
            take: 1,
          },
        },
      },
    },
  })
  return assessment
}

export const getCandidate = async ({
  assessmentId,
  candidateId,
}: {
  assessmentId: string
  candidateId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!candidateId) {
    throw Error('missing candidateId')
  }
  const candidate = await prisma.assessmentCandidate.findUnique({
    where: {
      assessmentId_candidateId: {
        candidateId,
        assessmentId,
      },
    },
  })
  return candidate
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
  const activityLogCount = await prisma.candidateActivityLog.count({
    where: {
      assessmentId: {
        in: assessmentIds,
      },
    },
  })
  return activityLogCount
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
}

export const deleteManyActivityLog = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const activityLogCount = await prisma.candidateActivityLog.deleteMany({
    where: {
      assessmentId,
    },
  })
  return activityLogCount
}
