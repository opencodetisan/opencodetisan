import {compressSync, decompressSync, strFromU8, strToU8} from 'fflate'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {glob} from 'glob'
import {
  IAssessmentPointsProps,
  IGetAssessmentComparativeScoreProps,
  IGetAssessmentQuizPointProps,
} from '@/types'
import prisma from '../db/client'
import {AssessmentComparativeScoreLevel, AssessmentPoint} from '@/enums'
import {MAX_SPEED_POINT_MULTIPLIER, QUIZ_COMPLETION_POINT} from '../constant'

export const writeSessionReplay = async ({
  data,
  userId,
  assessmentQuizSubId,
}: {
  data: {[key: string]: any}
  userId: string
  assessmentQuizSubId: string
}) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!assessmentQuizSubId) {
    throw Error('missing assessmentQuizSubId')
  } else if (!data) {
    throw Error('missing data')
  }
  await mkdir(`./src/session/${userId}`, {recursive: true})
  const files = await glob(`src/session/${userId}/${assessmentQuizSubId}_*`)
  const writePath = `./src/session/${userId}/${assessmentQuizSubId}_${
    files.length + 1
  }`
  const jsonStr = JSON.stringify(data)
  const buf = strToU8(jsonStr)
  const compressed = compressSync(buf, {level: 6, mem: 8})
  await writeFile(writePath, compressed)
  return writePath
}

export const readSessionReplay = async ({
  userId,
  assessmentQuizSubId,
}: {
  userId: string
  assessmentQuizSubId: string
}) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!assessmentQuizSubId) {
    throw Error('missing assessmentQuizSubId')
  }
  const sessionReplay = []
  const files = await glob(`src/session/${userId}/${assessmentQuizSubId}_*`)
  for (let i = 1; i <= files.length; i++) {
    const readPath = `./src/session/${userId}/${assessmentQuizSubId}_${i}`
    const buf = await readFile(readPath)
    const decompressed = decompressSync(buf)
    const json = JSON.parse(strFromU8(decompressed))
    sessionReplay.push(...json)
  }
  return sessionReplay
}

export const getAssessmentPoints = async () => {
  let object: IAssessmentPointsProps = {}
  const assessmentPoints = await prisma.assessmentPoint.findMany()
  if (assessmentPoints.length === 0) {
    return {}
  } else {
    assessmentPoints.forEach(
      (p: any) => (object[p.name] = {point: p.point, id: p.id}),
    )
  }
  return object
}

export const getAssessmentComparativeScore = ({
  usersCount,
  usersBelowPointCount,
  point,
  quizPoint,
}: IGetAssessmentComparativeScoreProps) => {
  if (usersCount === undefined) {
    throw Error('missing usersCount')
  } else if (usersBelowPointCount === undefined) {
    throw Error('missing usersBelowPointCount')
  } else if (point === undefined) {
    throw Error('missing point')
  }
  let comparativeScore = 100
  if (point && !usersCount) {
    comparativeScore = 100
  } else if (!point) {
    comparativeScore = 0
  } else if (point !== quizPoint) {
    comparativeScore = Math.round(+((usersBelowPointCount / usersCount) * 100))
  }

  return {comparativeScore, usersBelowPointCount}
}

export const getAssessmentComparativeScoreLevel = ({
  comparativeScore,
}: {
  comparativeScore: number
}) => {
  if (comparativeScore === undefined) {
    throw Error('missing comparativeScore')
  }
  if (comparativeScore < 49) {
    return AssessmentComparativeScoreLevel.Low
  } else if (comparativeScore < 79) {
    return AssessmentComparativeScoreLevel.Medium
  } else {
    return AssessmentComparativeScoreLevel.High
  }
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
