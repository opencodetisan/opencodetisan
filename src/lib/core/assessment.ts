import {
  IAddAssessmentQuizzesProps,
  ICandidateEmailStatusProps,
  IDeleteAssessmentQuizSubmissionsProps,
  IDeleteAssessmentResultProps,
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

export const deleteAssessmentResult = async ({
  assessmentId,
  quizId,
}: IDeleteAssessmentResultProps) => {
  if (!assessmentId) {
    throw new Error('missing assessmentId')
  } else if (!quizId) {
    throw new Error('missing quizId')
  }
  const rmvedSubmissions = await prisma.assessmentResult.deleteMany({
    where: {assessmentId, quizId},
  })
  return rmvedSubmissions
}
