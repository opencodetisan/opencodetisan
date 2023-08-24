import {
  IAddAssessmentQuizzesProps,
  ICandidateEmailStatusProps,
  ICreateAssessmentProps,
  IDeleteAssessmentQuizSubmissionsProps,
  IUpdateAssessmentAcceptanceProps,
  IUpdateAssessmentCandidateStatusProps,
  IUpdateAssessmentProps,
  IUpdateAssessmentResultProps,
} from '@/types'
import prisma from '../db/client'
import {CandidateActionId} from '@/enums'

export const createAssessment = async ({
  userId,
  title,
  description,
  quizIds,
}: ICreateAssessmentProps) => {
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

export const getAssessment = async ({
  assessmentId,
  callerSelections,
}: {
  assessmentId: string
  callerSelections?: {[key: string]: any}
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const selections = {
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
                    start: 'desc' as any,
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
    ...callerSelections,
  }
  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      id: true,
      ownerId: true,
      title: true,
      description: true,
      createdAt: true,
      ...selections,
    },
  })

  const data: Record<string, string | Date | number> = {}
  const candidates: Record<string, any>[] = []
  const submissions: Record<string, any>[] = []

  for (let key in assessment) {
    if (typeof assessment[key] === 'string' || key === 'createdAt') {
      data[key] = assessment[key]
    }
  }

  assessment?.assessmentCandidates.forEach((c) => {
    const candidateData = {}
    const submissionData = {name: '', data: []}
    const candidate = c.candidate

    for (let key in candidate) {
      if (typeof candidate[key] === 'string') {
        candidateData[key] = candidate[key]
      }
    }

    submissionData.name = candidate.name
    submissionData.data = candidate.assessmentResults

    candidates.push(candidateData)
    submissions.push(submissionData)
  })

  return {data, candidates, submissions}
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

export const getAssessmentQuizSubmission = async ({
  assessmentQuizSubmissionId,
}: {
  assessmentQuizSubmissionId: string
}) => {
  if (!assessmentQuizSubmissionId) {
    throw Error('missing assessmentQuizSubmissionId')
  }

  const assessmentQuizSubmission =
    await prisma.assessmentQuizSubmission.findUnique({
      where: {
        id: assessmentQuizSubmissionId,
      },
    })

  return assessmentQuizSubmission
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

export const updateAssessmentResult = async ({
  assessmentResultId,
  assessmentQuizSubmissionId,
  submissionId,
  timeTaken,
  status,
}: IUpdateAssessmentResultProps) => {
  const assessmentResult = await prisma.assessmentResult.update({
    where: {id: assessmentResultId},
    data: {
      status,
      timeTaken,
      assessmentQuizSubmissions: {
        update: {
          where: {
            id: assessmentQuizSubmissionId,
          },
          data: {
            end: new Date(),
            submissionId,
          },
        },
      },
    },
  })

  return assessmentResult
}

export const getAssessmentForReport = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const selections = {
    owner: {
      select: {
        id: true,
        name: true,
      },
    },
    assessmentCandidates: {
      select: {
        status: true,
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
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
        quizId: true,
        submissionId: true,
        quiz: {
          select: {
            id: true,
            codeLanguageId: true,
            difficultyLevelId: true,
            title: true,
            difficultyLevel: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    },
  }
  const assessment = await getAssessment({
    assessmentId,
    callerSelections: selections,
  })
  return assessment
}
