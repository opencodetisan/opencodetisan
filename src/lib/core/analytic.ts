import {compressSync, decompressSync, strFromU8, strToU8} from 'fflate'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {glob} from 'glob'
import {IAssessmentPointsProps} from '@/types'
import prisma from '../db/client'

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
