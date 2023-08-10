import {compressSync, decompressSync, strFromU8, strToU8} from 'fflate'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {glob} from 'glob'

export const compressJsonStr = (jsonStr: string) => {
  if (!jsonStr) {
    throw Error('missing data')
  }
  const buf = strToU8(jsonStr)
  const compressed = compressSync(buf, {level: 6, mem: 8})
  return compressed
}

export const decompressBuf = (buf: Uint8Array) => {
  if (!buf) {
    throw Error('missing buf')
  }
  const decompressed = decompressSync(buf)
  return JSON.parse(strFromU8(decompressed))
}

export const createDir = ({
  path,
  recursive,
}: {
  path: string
  recursive: boolean
}) => {
  if (!path) {
    throw Error('missing path')
  } else if (!recursive) {
    throw Error('missing recursive')
  }
  mkdir(path, {recursive}, (err) => {
    if (err) throw err
  })
}

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

export const getLocalFiles = async ({
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
}
