import {
  IAddAssessmentQuizzesProps,
  IAssessmentDataProps,
  IAssessmentResultProps,
  ICandidateEmailStatusProps,
  ICreateAssessmentProps,
  IDeleteAssessmentQuizSubmissionsProps,
  IQuizDataProps,
  IUpdateAssessmentAcceptanceProps,
  IUpdateAssessmentProps,
  IUpdateAssessmentResultProps,
  IUserProps,
} from '@/types'
import prisma from '../db/client'
import {AssessmentStatus, CandidateActionId} from '@/enums'
import {DateTime} from 'luxon'

export const createAssessment = async ({
  userId,
  title,
  description,
  quizIds,
  startAt,
  endAt,
}: ICreateAssessmentProps) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!title) {
    throw Error('missing title')
  } else if (!description) {
    throw Error('missing description')
  } else if (!quizIds) {
    throw Error('missing quizIds')
  } else if (!startAt) {
    throw Error('missing startAt')
  } else if (!endAt) {
    throw Error('missing endAt')
  }
  const startDt = DateTime.fromISO(startAt)
  const endDt = DateTime.fromISO(endAt)
  const assessment = await prisma.assessment.create({
    data: {
      ownerId: userId,
      title,
      description,
      startAt: startDt.toISO()!,
      endAt: endDt.toISO()!,
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

export const getManyAssessmentResult = async ({
  candidateId,
  assessmentId,
}: {
  candidateId?: string
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessmentResults = await prisma.assessmentResult.findMany({
    where: {
      assessmentId,
      candidateId: candidateId ?? undefined,
    },
  })
  return assessmentResults
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
      owner: {
        select: {
          name: true,
        },
      },
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
            codeLanguageId: true,
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
      startAt: true,
      endAt: true,
      ...selections,
    },
  })

  if (!assessment) {
    return null
  }

  const data: Record<string, string | Date | number> = {}
  const candidates: Record<string, any>[] = []
  const submissions: Record<string, any>[] = []
  const quizzes: Record<string, any>[] = []

  assessment?.assessmentQuizzes.forEach(
    (q: {quiz: Partial<IQuizDataProps>}) => {
      quizzes.push(q.quiz)
    },
  )

  for (let key in assessment) {
    const k = key as keyof IAssessmentDataProps

    if (typeof assessment[k] === 'string' || key.endsWith('At')) {
      data[k] = assessment[k]
    }
  }

  // TODO: Replace any type with a proper type
  assessment?.assessmentCandidates.forEach((c: any) => {
    const candidateData: IUserProps = {id: '', name: ''}
    const candidate = c.candidate
    const submissionData: {
      id: string
      name: string
      data: IAssessmentResultProps[]
    } = {id: '', name: '', data: []}

    for (let key in candidate) {
      const k = key as keyof IUserProps

      if (typeof candidate[k] === 'string') {
        candidateData[k] = candidate[k] as string
      }
    }

    submissionData.id = candidate.id
    submissionData.name = candidate.name as string
    submissionData.data = candidate.assessmentResults

    candidates.push(candidateData)
    submissions.push(submissionData)
  })

  return {data, candidates, submissions, quizzes}
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

export const getManyAssessmentResultId = async ({
  assessmentId,
}: {
  assessmentId: string
}): Promise<string[]> => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }

  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      assessmentResults: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!assessment) {
    return []
  }

  const assessmentResultIds = assessment.assessmentResults.map(
    (result: Pick<IAssessmentResultProps, 'id'>) => result.id,
  )

  return assessmentResultIds
}

export const deleteManyAssessmentQuizSubmission = async ({
  manyAssessmentQuizSubmissionId,
}: {
  manyAssessmentQuizSubmissionId: string[]
}) => {
  if (!manyAssessmentQuizSubmissionId?.length) {
    throw Error('missing manyAssessmentQuizSubmissionId')
  }
  const assessmentResult = await prisma.assessmentQuizSubmission.deleteMany({
    where: {
      assessmentResultId: {
        in: manyAssessmentQuizSubmissionId,
      },
    },
  })
  return assessmentResult
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

export const deleteManyAssessmentResult = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessmentResultCount = await prisma.assessmentResult.deleteMany({
    where: {
      assessmentId,
    },
  })
  return assessmentResultCount
}

export const deleteManyAssessmentQuiz = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessmentQuizCount = await prisma.assessmentQuiz.deleteMany({
    where: {
      assessmentId,
    },
  })
  return assessmentQuizCount
}

export const deleteAssessmentCandidate = async ({
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
  const assessment = await prisma.assessment.update({
    where: {
      id: assessmentId,
    },
    data: {
      assessmentResults: {
        deleteMany: {
          assessmentId,
          candidateId,
        },
      },
      assessmentCandidates: {
        delete: {
          assessmentId_candidateId: {
            assessmentId,
            candidateId,
          },
        },
      },
    },
  })
  return assessment
}

export const deleteManyAssessmentCandidate = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessmentCandidateCount = await prisma.assessmentCandidate.deleteMany({
    where: {
      assessmentId,
    },
  })
  return assessmentCandidateCount
}

export const deleteManyAssessmentCandidateEmail = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessmentCandidateEmailCount =
    await prisma.assessmentCandidateEmail.deleteMany({
      where: {
        assessmentId,
      },
    })
  return assessmentCandidateEmailCount
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

export const deleteAssessmentData = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const assessment = await prisma.assessment.delete({
    where: {
      id: assessmentId,
    },
  })
  return assessment
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
  if (!assessmentResultId) {
    throw Error('missing assessmentResultId')
  } else if (!assessmentQuizSubmissionId) {
    throw Error('missing assessmentQuizSubmissionId')
  } else if (!submissionId) {
    throw Error('missing submissionId')
  } else if (typeof timeTaken !== 'number') {
    throw Error('invalid timeTaken')
  } else if (!status) {
    throw Error('missing status')
  }

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

export const updateAssessmentCandidateStatus = async ({
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
  const assessment = await prisma.assessment.update({
    where: {
      id: assessmentId,
    },
    data: {
      candidateActivityLog: {
        create: {
          userActionId: CandidateActionId.Complete,
          userId: candidateId,
        },
      },
      assessmentCandidates: {
        update: {
          where: {
            assessmentId_candidateId: {
              assessmentId,
              candidateId,
            },
          },
          data: {
            status: AssessmentStatus.COMPLETED,
          },
        },
      },
    },
  })
  return assessment
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

// TODO: test
export const getAllAssessmentCandidate = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  }
  const emails: {[key: string]: boolean} = {}
  const assessmentCandidate = await prisma.assessmentCandidate.findMany({
    where: {
      assessmentId,
    },
    select: {
      candidate: {
        select: {
          email: true,
        },
      },
    },
  })
  assessmentCandidate.forEach((candidate) => {
    emails[candidate.candidate.email] = true
  })
  return emails
}
