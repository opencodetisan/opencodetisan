import {ICreateAssessmentServiceProps} from '@/types'
import {
  createAssessment,
  getAssessmentIds,
  getAssessmentQuizzes,
  getAssessments,
  updateAssessmentAcceptance,
} from './assessment'
import {getActivityLogCount, getActivityLogs} from './candidate'

export const acceptAssessmentService = async ({
  assessmentId,
  token,
  userId,
}: {
  assessmentId: string
  token: string
  userId: string
}) => {
  if (!assessmentId) {
    throw Error('missing assessmentId')
  } else if (!token) {
    throw Error('missing token')
  } else if (!userId) {
    throw Error('missing userId')
  }
  const assessmentQuizzes = await getAssessmentQuizzes({assessmentId})
  const assessmentResults = assessmentQuizzes.map((q: any) => ({
    candidateId: userId,
    quizId: q.quizId,
  }))
  const assessment = await updateAssessmentAcceptance({
    assessmentId,
    assessmentResults,
    candidateId: userId,
    token,
  })
  return assessment
}

export const getCandidateActivityLogService = async ({
  index,
  userId,
  amount,
}: {
  index: number
  amount: number
  userId: string
}) => {
  if (!index) {
    throw Error('missing index')
  } else if (!amount) {
    throw Error('missing amount')
  } else if (!userId) {
    throw Error('missing userId')
  }
  const assessmentIds = await getAssessmentIds({userId})
  const activityLogCount = await getActivityLogCount({assessmentIds})
  const activityLogs = await getActivityLogs({
    assessmentIds,
    amount,
    skip: index,
  })
  return {activityLogCount, activityLogs}
}

export const getAssessmentsService = async ({userId}: {userId: string}) => {
  if (!userId) {
    throw Error('missing userId')
  }
  const assessments = await getAssessments({userId})
  return assessments
}

export const createAssessmentService = async ({
  userId,
  title,
  description,
  quizIds,
}: ICreateAssessmentServiceProps) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!title) {
    throw Error('missing title')
  } else if (!description) {
    throw Error('missing description')
  } else if (!quizIds) {
    throw Error('missing quizIds')
  } else if (quizIds.length === 0) {
    throw Error('empty quizIds')
  }
  const assessment = await createAssessment({
    userId,
    title,
    description,
    quizIds,
  })
  return assessment
}
