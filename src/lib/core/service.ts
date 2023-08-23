import {
  ICreateAssessmentServiceProps,
  ICreateQuizServiceProps,
  IUpdateQuizDataServiceProps,
  IUpdateQuizSolutionServiceProps,
} from '@/types'
import {
  createAssessment,
  getAssessment,
  getAssessmentIds,
  getAssessmentQuizzes,
  getAssessments,
  updateAssessmentAcceptance,
} from './assessment'
import {getActivityLogCount, getActivityLogs} from './candidate'
import {
  createQuiz,
  createQuizSolution,
  createQuizTestCase,
  deleteQuiz,
  deleteQuizSolution,
  deleteQuizTestCases,
  getQuiz,
  getQuizTestCases,
  getSolutionAndTestId,
  updateQuiz,
  updateQuizSolution,
  updateQuizTestCase,
} from './quiz'
import {MAX_SPEED_POINT_MULTIPLIER, QUIZ_COMPLETION_POINT} from '../constant'
import {getAssessmentPoints} from './analytic'
import {AssessmentPoint} from '@/enums'

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

  const solutionPromises: Promise<any>[] = []
  const testCasePromises: Promise<any>[] = []

  quizSolution.forEach((solution, i) => {
    solutionPromises.push(
      createQuizSolution({
        quizId: quiz.id,
        code: solution.code,
        sequence: i,
        importDirectives: solution.importDirectives,
        testRunner: solution.testRunner,
      }),
    )
  })

  const solutions = await Promise.all(solutionPromises)

  solutions.forEach((solution, solutionIndex) => {
    quizTestCases[solutionIndex].forEach((test, testIndex) => {
      testCasePromises.push(
        createQuizTestCase({
          solutionId: solution.id,
          input: test.input,
          output: test.output,
          sequence: testIndex,
        }),
      )
    })
  })

  const testCases = await Promise.all(testCasePromises)

  return {
    quizData: quiz,
    quizSolution: solutions,
    quizTestCase: testCases,
  }
}

export const getQuizService = async ({quizId}: {quizId: string}) => {
  const quiz = await getQuiz({quizId})
  return quiz
}

export const updateQuizDataService = async ({
  quizData,
}: IUpdateQuizDataServiceProps) => {
  const quiz = await updateQuiz(quizData)
  return quiz
}

export const updateQuizSolutionService = async ({
  quizSolution,
  quizTestCase,
}: IUpdateQuizSolutionServiceProps) => {
  const solutionPromises: Promise<any>[] = []
  const testCasePromises: Promise<any>[] = []

  quizSolution.forEach((solution) => {
    solutionPromises.push(
      updateQuizSolution({
        solutionId: solution.solutionId,
        code: solution.code,
        importDirectives: solution.importDirectives,
        testRunner: solution.testRunner,
        defaultCode: solution.defaultCode,
      }),
    )
  })

  const solutions = await Promise.all(solutionPromises)

  quizTestCase.forEach((test) => {
    testCasePromises.push(
      updateQuizTestCase({
        testCaseId: test.testCaseId,
        input: test.input,
        output: test.output,
      }),
    )
  })

  const testCases = await Promise.all(testCasePromises)

  return {quizSolution: solutions, quizTestCase: testCases}
}

export const createAssessmentService = async ({
  userId,
  title,
  description,
  quizIds,
}: ICreateAssessmentServiceProps) => {
  const assessment = await createAssessment({
    userId,
    title,
    description,
    quizIds,
  })
  return assessment
}

export const getAssessmentService = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  const assessment = await getAssessment({
    assessmentId,
  })

  if (!assessment) {
    return {}
  } else if (!assessment.candidates.length) {
    return assessment
  }

  let totalPoint = 0
  let quizPoints: Record<string, number> = {}
  const assignedQuizzes: any = []

  const assessmentPoints = await getAssessmentPoints()

  assessment.quizzes?.forEach((q) => {
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
  console.log(quizPoints)

  return assessment
}

export const deleteQuizService = async ({quizId}: {quizId: string}) => {
  const quiz = (await getSolutionAndTestId({quizId})) as {
    solutionId: string[]
    testCaseId: string[]
  }

  if (!Object.keys(quiz).length) {
    throw Error('Quiz does not exits')
  }

  const testCasePromises: Promise<any>[] = []
  const solutionPromises: Promise<any>[] = []

  quiz.testCaseId.forEach((id) =>
    testCasePromises.push(deleteQuizTestCases({testCaseId: id})),
  )
  const quizTestCase = await Promise.all(testCasePromises)

  quiz.solutionId.forEach((id) =>
    solutionPromises.push(deleteQuizSolution({solutionId: id})),
  )
  const quizSolution = await Promise.all(solutionPromises)

  const quizData = await deleteQuiz({quizId})

  return {
    quizData,
    quizSolution,
    quizTestCase,
  }
}
