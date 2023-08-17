import {
  ICreateAssessmentServiceProps,
  ICreateQuizServiceProps,
  IUpdateQuizServiceProps,
} from '@/types'
import {
  createAssessment,
  getAssessmentIds,
  getAssessmentQuizzes,
  getAssessments,
  updateAssessmentAcceptance,
} from './assessment'
import {getActivityLogCount, getActivityLogs} from './candidate'
import {
  createQuiz,
  createQuizSolution,
  createQuizTestCases,
  getQuiz,
  getQuizTestCases,
  updateQuiz,
  updateQuizSolution,
  updateQuizTestCases,
} from './quiz'

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

export const getManyAssessmentService = async ({userId}: {userId: string}) => {
  if (!userId) {
    throw Error('missing userId')
  }
  const assessments = await getAssessments({userId})
  return assessments
}

export const createQuizService = async ({
  quizData,
  quizSolution,
  quizTestCases,
}: ICreateQuizServiceProps) => {
  const quiz = await createQuiz(quizData)
  const solution = await createQuizSolution({
    quizId: quiz.id,
    code: quizSolution.code,
    sequence: quizSolution.sequence,
    importDirectives: quizSolution.importDirectives,
    testRunner: quizSolution.testRunner,
  })
  const testCaseData = []
  for (let i = 0; i < quizTestCases.input.length; i++) {
    testCaseData.push({
      solutionId: solution.id,
      input: quizTestCases.input[i],
      output: quizTestCases.output[i],
      sequence: i,
    })
  }
  const testCases = await createQuizTestCases(testCaseData)
  return {quizData: quiz, quizSolution: [solution], quizTestCases: testCases}
}

export const getQuizService = async ({quizId}: {quizId: string}) => {
  const quiz = await getQuiz({quizId})
  return quiz
}

export const updateQuizService = async ({
  quizData,
  quizSolution,
  quizTestCases,
}: IUpdateQuizServiceProps) => {
  const quiz = await updateQuiz(quizData)
  const solution = await updateQuizSolution(quizSolution)
  const existingTests = await getQuizTestCases({solutionId: solution.id})
  const testCases = await updateQuizTestCases({
    newTests: quizTestCases,
    existingTests,
  })
  return {quizData: quiz, quizSolution: [solution], quizTestCases: testCases}
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
