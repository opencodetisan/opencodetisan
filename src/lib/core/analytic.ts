import {compressSync, decompressSync, strFromU8, strToU8} from 'fflate'
import {mkdir} from 'node:fs'
import {readFile, writeFile} from 'node:fs/promises'

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
  path,
  data,
}: {
  path: string
  data: string | Uint8Array
}) => {
  if (!path) {
    throw Error('missing path')
  } else if (!data) {
    throw Error('missing data')
  }
  await writeFile(path, data, {encoding: 'binary'})
}

export const readLocalFile = async ({pathToFile}: {pathToFile: string}) => {
  if (!pathToFile) {
    throw Error('missing pathToFile')
  }
  const data = await readFile(pathToFile)
  return data
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
