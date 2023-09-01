import {
  ICreateAssessmentServiceProps,
  ICreateQuizServiceProps,
  IUpdateAssessmentDataServiceProps,
  IUpdateQuizDataServiceProps,
  IUpdateQuizSolutionServiceProps,
} from '@/types'
import {
  createAssessment,
  deleteAssessmentData,
  deleteAssessmentQuiz,
  deleteManyAssessmentCandidate,
  deleteManyAssessmentCandidateEmail,
  deleteManyAssessmentQuiz,
  deleteManyAssessmentQuizSubmission,
  deleteManyAssessmentResult,
  getAssessment,
  getAssessmentIds,
  getAssessmentQuizSubmission,
  getAssessmentQuizzes,
  getAssessments,
  getManyAssessmentResult,
  getManyAssessmentResultId,
  updateAssessment,
  updateAssessmentAcceptance,
  updateAssessmentCandidateStatus,
  updateAssessmentResult,
} from './assessment'
import {
  createNewQuizAttempt,
  deleteManyActivityLog,
  getActivityLogCount,
  getActivityLogs,
  getCandidateResult,
} from './candidate'
import {
  createQuiz,
  createQuizSolution,
  createQuizSubmission,
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
import {
  createCandidatePoint,
  getAssessmentComparativeScore,
  getAssessmentComparativeScoreLevel,
  getAssessmentPoints,
  getAssessmentUsersBelowPointCount,
  getAssessmentUsersCount,
} from './analytic'
import {AssessmentPoint} from '@/enums'
import prisma from '../db/client'
import {
  convertToMinuteSecond,
  getCandidatePointLevel,
  getQuizTimeLimit,
} from '../utils'

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

export const createCandidateSubmissionService = async ({
  assessmentId,
  quizId,
  userId,
}: {
  assessmentId: string
  quizId: string
  userId: string
}) => {
  const assessment = await getCandidateResult({userId, quizId, assessmentId})

  const assessmentResult = assessment?.assessmentResults[0]

  if (!assessmentResult) {
    return {}
  }

  const updatedAssessmentResult = await createNewQuizAttempt({
    assessmentResultId: assessmentResult.id,
  })
  return updatedAssessmentResult
}

export const updateCandidateSubmissionService = async ({
  userId,
  quizId,
  code,
  assessmentQuizSubmissionId,
}: {
  userId: string
  quizId: string
  code: string
  assessmentQuizSubmissionId: string
}) => {
  const submission = await createQuizSubmission({code, quizId, userId})

  const difficultyLevel = submission.quiz.difficultyLevel.name

  const assessmentQuizSubmission = await getAssessmentQuizSubmission({
    assessmentQuizSubmissionId,
  })

  if (!assessmentQuizSubmission) {
    return {}
  }

  const start = new Date(assessmentQuizSubmission?.start as Date).getTime()
  const end = new Date().getTime()

  const timeTaken =
    Math.round(((end - start) / 1000 + Number.EPSILON) * 100) / 100

  const assessmentResult = await updateAssessmentResult({
    status: 'COMPLETED',
    timeTaken,
    assessmentQuizSubmissionId: assessmentQuizSubmissionId,
    assessmentResultId: assessmentQuizSubmission.assessmentResultId,
    submissionId: submission.id,
  })

  const assessmentPoint = await getAssessmentPoints()

  let {id: quizPointId, point: quizPointInt} =
    assessmentPoint![difficultyLevel + QUIZ_COMPLETION_POINT]
  let {id: speedPointId, point: speedPointInt} =
    assessmentPoint![AssessmentPoint.SpeedPoint]

  const timeLimit = getQuizTimeLimit(difficultyLevel)
  const minutesTaken = convertToMinuteSecond(timeTaken)?.minutes

  if (minutesTaken <= timeLimit / 2) {
    speedPointInt *= 1.2
  } else if (minutesTaken <= timeLimit * 0.7) {
    speedPointInt *= 1.1
  } else if (minutesTaken <= timeLimit * 0.85) {
    speedPointInt *= 1.05
  } else if (minutesTaken > timeLimit) {
    speedPointInt = 0
  }

  const totalPoint = quizPointInt + speedPointInt

  const submissionPoint = [
    {
      userId,
      point: quizPointInt,
      assessmentPointId: parseInt(quizPointId),
    },
    {
      userId,
      point: Math.round(speedPointInt),
      assessmentPointId: parseInt(speedPointId),
    },
  ]

  await createCandidatePoint({
    totalPoint,
    submissionPoint,
    quizId,
    userId,
    submissionId: submission.id,
  })

  const assessmentResults = await getManyAssessmentResult({
    assessmentId: assessmentResult.assessmentId,
    candidateId: userId,
  })

  const allCompleted = assessmentResults.every((r) => r.status === 'COMPLETED')

  if (allCompleted) {
    updateAssessmentCandidateStatus({
      candidateId: userId,
      assessmentId: assessmentResult.assessmentId,
    })
  }
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

  let maxPoint = 0
  let maxQuizPoints: Record<string, number> = {}
  const assignedQuizzes: any = []

  const assessmentPoints = await getAssessmentPoints()

  assessment.quizzes?.forEach((q) => {
    const assessmentPointName = `${q.difficultyLevel.name}${QUIZ_COMPLETION_POINT}`
    const difficultyPoint = assessmentPoints[assessmentPointName]?.point
    const speedPoint =
      assessmentPoints[AssessmentPoint.SpeedPoint]?.point *
      MAX_SPEED_POINT_MULTIPLIER

    const sum = difficultyPoint + speedPoint

    assignedQuizzes.push(q.quiz)
    maxPoint += sum
    maxQuizPoints[q.id] = sum
  })

  const candidateSubmissions = assessment.submissions

  for (let i = 0; i < candidateSubmissions.length; i++) {
    const submissions = candidateSubmissions[i].data
    const userId = candidateSubmissions[i].id

    for (let j = 0; j < submissions.length; j++) {
      let totalPoint = 0

      const assessmentQuizSubmissions = submissions[j].assessmentQuizSubmissions
      const quizId = submissions[j].quizId

      if (assessmentQuizSubmissions.length) {
        let point = 0

        const quizSubmission = assessmentQuizSubmissions[0].submission

        quizSubmission.submissionPoint.forEach((s: Record<string, any>) => {
          point += s.point
          totalPoint += s.point
        })

        const players = await getAssessmentUsersCount({quizId, userId})

        const defeatedPlayers = await getAssessmentUsersBelowPointCount({
          userId,
          quizId,
          point,
        })

        const comparativeScore = getAssessmentComparativeScore({
          point,
          usersCount: players,
          quizPoint: maxQuizPoints[quizId],
          usersBelowPointCount: defeatedPlayers,
        })

        const comparativeScoreLevel = getAssessmentComparativeScoreLevel({
          comparativeScore,
        })

        quizSubmission.point = point
        quizSubmission.comparativeScore = comparativeScore
        quizSubmission.comparativeScoreLevel = comparativeScoreLevel
        delete quizSubmission.submissionPoint
      }
      const totalPointLevel = getCandidatePointLevel(totalPoint)

      submissions[j].totalPoint = totalPoint
      submissions[j].totalPointLevel = totalPointLevel
    }
  }

  return assessment
}

export const updateAssessmentDataService = async ({
  title,
  description,
  assessmentId,
}: IUpdateAssessmentDataServiceProps) => {
  const assessment = await updateAssessment({title, description, assessmentId})

  return assessment
}

export const deleteAssessmentService = async ({
  assessmentId,
}: {
  assessmentId: string
}) => {
  const manyAssessmentQuizSubmissionId = await getManyAssessmentResultId({
    assessmentId,
  })

  if (manyAssessmentQuizSubmissionId.length) {
    await deleteManyAssessmentQuizSubmission({
      manyAssessmentQuizSubmissionId,
    })
  }

  await deleteManyAssessmentResult({assessmentId})
  await deleteManyAssessmentQuiz({assessmentId})
  await deleteManyAssessmentCandidate({assessmentId})
  await deleteManyAssessmentCandidateEmail({assessmentId})
  await deleteManyActivityLog({assessmentId})
  await deleteAssessmentData({assessmentId})

  return true
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
