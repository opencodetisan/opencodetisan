import {
  IAddAssessmentQuizzesProps,
  ICandidateEmailStatusProps,
  IDeleteAssessmentQuizSubmissionsProps,
  IGetAssessmentQuizPointProps,
  IUpdateAssessmentAcceptanceProps,
  IUpdateAssessmentCandidateStatusProps,
  IUpdateAssessmentProps,
  IcreateAssessmentProps,
} from '@/types'
import prisma from '../db/client'
import {AssessmentPoint, CandidateActionId} from '@/enums'
import {MAX_SPEED_POINT_MULTIPLIER, QUIZ_COMPLETION_POINT} from '../constant'

export const createAssessment = async ({
  userId,
  title,
  description,
  quizIds,
}: IcreateAssessmentProps) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!title) {
    throw Error('missing title')
  } else if (!description) {
    throw Error('missing description')
  } else if (!quizIds) {
    throw Error('missing quizIds')
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

export const createAssessmentCandidateEmails = async (
  candidateEmails: ICandidateEmailStatusProps[],
) => {
  let missingField
  const hasAllProps = candidateEmails.every((email) => {
    return ['assessmentId', 'email', 'statusCode', 'errorMessage'].every(
      (prop) => {
        if (!Object.hasOwn(email, prop)) {
          missingField = prop
          return false
        }
        return true
      },
    )
  })
  if (!hasAllProps) {
    throw Error(`missing ${missingField}`)
  }
  const emails = await prisma.assessmentCandidateEmail.createMany({
    data: candidateEmails,
  })
  return emails
}

export const updateAssessment = async ({
  assessmentId,
  title,
  description,
}: IUpdateAssessmentProps) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!title) {
    throw Error('missing title')
  } else if (!description) {
    throw Error('missing description')
  }
  const updatedAssessment = await prisma.assessment.update({
    where: {
      id: assessmentId,
    },
    data: {
      title,
      description,
    },
  })
  return updatedAssessment
}

export const updateAssessmentCandidateStatus = async ({
  assessmentId,
  candidateId,
}: IUpdateAssessmentCandidateStatusProps) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!candidateId) {
    throw Error('missing candidateId')
  }
  const assessmentCandidate = await prisma.assessmentCandidate.update({
    where: {
      assessmentId_candidateId: {
        assessmentId,
        candidateId,
      },
    },
    data: {
      status: 'COMPLETED',
    },
  })
  return assessmentCandidate
}

export const addAssessmentQuizzes = async ({
  quizIds,
  assessmentId,
}: IAddAssessmentQuizzesProps) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!quizIds) {
    throw Error('missing quizIds')
  } else if (quizIds.length === 0) {
    throw Error('0 quizId found')
  }

  const quizzes = await prisma.assessmentQuiz.createMany({
    data: quizIds.map((quizId) => {
      return {quizId, assessmentId}
    }),
  })
  return quizzes
}

export const getAssessmentResult = async ({
  quizId,
  assessmentId,
}: IAddAssessmentQuizzesProps) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!quizId) {
    throw Error('missing quizId')
  }
  const assessmentResult = await prisma.assessmentResult.findFirst({
    where: {
      assessmentId,
      quizId,
    },
    include: {
      assessmentQuizSubmissions: true,
    },
  })
  return assessmentResult
}

export const deleteAssessmentQuizSubmissions = async ({
  submissionIds,
}: IDeleteAssessmentQuizSubmissionsProps) => {
  if (!submissionIds) {
    throw Error('missing submissionIds')
  } else if (submissionIds.length === 0) {
    return null
  }
  const rmvedSubmissions = await prisma.assessmentQuizSubmission.deleteMany({
    where: {
      id: {
        in: submissionIds,
      },
    },
  })
  return rmvedSubmissions
}

export const getAssessments = async ({userId}: {userId: string}) => {
  if (!userId) {
    throw Error('missing userId')
  }
  const assessments = await prisma.assessment.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      assessmentQuizzes: {
        select: {
          quizId: true,
        },
      },
      assessmentCandidates: {
        select: {
          status: true,
          candidate: {
            select: {
              name: true,
            },
          },
        },
      },
      createdAt: true,
      description: true,
    },
  })
  return assessments
}

export const getAssessment = async ({assessmentId}: {assessmentId: string}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      title: true,
      description: true,
      createdAt: true,
      assessmentCandidateEmail: {
        select: {
          id: true,
          email: true,
          statusCode: true,
        },
      },
      assessmentCandidates: {
        select: {
          status: true,
          candidate: {
            select: {
              id: true,
              name: true,
              assessmentResults: {
                where: {
                  assessmentId: assessmentId,
                },
                include: {
                  quiz: {
                    select: {
                      id: true,
                      codeLanguageId: true,
                      difficultyLevelId: true,
                      title: true,
                      instruction: true,
                    },
                  },
                  assessmentQuizSubmissions: {
                    where: {
                      submissionId: {
                        not: null,
                      },
                    },
                    select: {
                      id: true,
                      submission: {
                        select: {
                          code: true,
                          submissionPoint: {
                            include: {
                              assessmentPoint: true,
                            },
                          },
                        },
                      },
                    },
                    orderBy: {
                      start: 'desc',
                    },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
      assessmentQuizzes: {
        select: {
          quiz: {
            select: {
              id: true,
              title: true,
              instruction: true,
              difficultyLevelId: true,
              difficultyLevel: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  })
  return assessment
}

export const getAssessmentCompletedQuiz = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessmentResults = await prisma.assessmentResult.findMany({
    where: {
      assessmentId,
      status: 'COMPLETED',
    },
    select: {
      quizId: true,
    },
    distinct: ['quizId'],
  })

  return assessmentResults
}

export const getAssessmentQuizPoint = async ({
  assessmentQuizzes,
  assessmentPoints,
}: IGetAssessmentQuizPointProps) => {
  if (!assessmentQuizzes) {
    throw Error('missing assessmentQuizzes')
  } else if (assessmentQuizzes.length === 0) {
    throw Error('assessmentQuizzes is empty')
  } else if (!assessmentPoints) {
    throw Error('missing assessmentPoints')
  }
  const assignedQuizzes: any = []
  let totalPoint = 0
  let quizPoints: {[index: string]: number} = {}
  assessmentQuizzes.forEach((q) => {
    const assessmentPointName = `${q.quiz.difficultyLevel.name}${QUIZ_COMPLETION_POINT}`
    const difficultyPoint = assessmentPoints[assessmentPointName]?.point
    const speedPoint =
      assessmentPoints[AssessmentPoint.SpeedPoint]?.point *
      MAX_SPEED_POINT_MULTIPLIER
    const sum = difficultyPoint + speedPoint
    assignedQuizzes.push(q.quiz)
    totalPoint += sum
    quizPoints[q.quiz.id] = sum
  })
  return {totalPoint, quizPoints, assignedQuizzes}
}

export const getAssessmentUsersCount = async ({
  userId,
  quizId,
}: {
  userId: string
  quizId: string
}) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!quizId) {
    throw Error('missing quizId')
  }
  const usersCount = await prisma.quizPointCollection.count({
    where: {
      quizId,
      userId: {
        not: userId,
      },
    },
  })
  return usersCount
}

export const getAssessmentUsersBelowPointCount = async ({
  userId,
  quizId,
  point,
}: {
  userId: string
  quizId: string
  point: number
}) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!quizId) {
    throw Error('missing quizId')
  } else if (!point) {
    throw Error('missing point')
  }
  const usersCount = await prisma.quizPointCollection.count({
    where: {
      quizId,
      userId: {
        not: userId,
      },
      point: {
        lt: point,
      },
    },
  })
  return usersCount
}

export const deleteAssessmentResult = async ({
  assessmentResultId,
}: {
  assessmentResultId: string
}) => {
  if (!assessmentResultId) {
    throw Error('missing assessmentResultId')
  }
  const assessmentResult = await prisma.assessmentResult.delete({
    where: {id: assessmentResultId},
  })
  return assessmentResult
}

export const deleteAssessmentQuiz = async ({
  assessmentId,
  quizId,
}: {
  assessmentId: string
  quizId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!quizId) {
    throw Error('missing quizId')
  }
  const assessmentResult = await prisma.assessmentQuiz.delete({
    where: {
      assessmentId_quizId: {
        assessmentId,
        quizId,
      },
    },
  })
  return assessmentResult
}

export const getAssessmentIds = async ({
  userId,
  amount = 1,
}: {
  userId: string
  amount?: number
}): Promise<string[]> => {
  if (!userId) {
    throw Error('missing userId')
  }
  const assessments: {id: string}[] = await prisma.assessment.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
    },
    take: amount,
  })

  return assessments.map((a) => a.id)
}

export const getAssessmentQuizzes = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const quiz = await prisma.assessmentQuiz.findMany({
    where: {
      assessmentId,
    },
  })
  return quiz
}

export const updateAssessmentAcceptance = async ({
  assessmentId,
  candidateId,
  assessmentResults,
  token,
}: IUpdateAssessmentAcceptanceProps) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!candidateId) {
    throw Error('missing candidateId')
  } else if (!assessmentResults) {
    throw Error('missing assessmentResults')
  } else if (assessmentResults.length === 0) {
    throw Error('empty assessmentResults')
  } else if (!token) {
    throw Error('missing token')
  }
  const assessment = await prisma.assessment.update({
    where: {
      id: assessmentId,
    },
    data: {
      assessmentCandidates: {
        create: {
          candidateId,
          token: token,
        },
      },
      assessmentResults: {
        create: assessmentResults,
      },
      candidateActivityLog: {
        create: {
          userId: candidateId,
          userActionId: CandidateActionId.Accept,
        },
      },
    },
  })
  return assessment
}
