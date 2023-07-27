import {
  IAddAssessmentQuizzesProps,
  ICandidateEmailStatusProps,
  IDeleteAssessmentQuizSubmissionsProps,
  IUpdateAssessmentCandidateStatusProps,
  IUpdateAssessmentProps,
  IcreateAssessmentProps,
} from '@/types'
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
    throw new Error(`missing ${missingField}`)
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
    throw new Error('missing assessmentId')
  } else if (!title) {
    throw new Error('missing title')
  } else if (!description) {
    throw new Error('missing description')
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
    throw new Error('missing assessmentId')
  } else if (!candidateId) {
    throw new Error('missing candidateId')
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
    throw new Error('missing assessmentId')
  } else if (!quizIds) {
    throw new Error('missing quizIds')
  } else if (quizIds.length === 0) {
    throw new Error('0 quizId found')
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
    throw new Error('missing assessmentId')
  } else if (!quizId) {
    throw new Error('missing quizId')
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
    throw new Error('missing submissionIds')
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
    throw new Error('missing userId')
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
    throw new Error('missing assessmentId')
  }
  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      title: true,
      description: true,
      createdAt: true,
      owner: {
        select: {
          subscription: {
            select: {
              price: {
                select: {
                  label: true,
                },
              },
            },
          },
        },
      },
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
    throw new Error('missing assessmentId')
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

export const getAssessmentPoints = async () => {
  let object: {[key: string]: {point: number; id: number}} = {}
  const assessmentPoints = await prisma.assessmentPoint.findMany()
  if (assessmentPoints.length === 0) {
    return {}
  } else {
    assessmentPoints.forEach(
      (p) => (object[p.name] = {point: p.point, id: p.id}),
    )
  }
  return object
}
