import {compressSync, decompressSync, strFromU8, strToU8} from 'fflate'
import {mkdir, writeFile} from 'node:fs'
import {readFile} from 'node:fs/promises'

export const convertToMinuteSecond = (seconds: number) => {
  if (!seconds) {
    throw Error('missing seconds')
  }
  const minutes = Math.floor(seconds / 60)
  const newSeconds = Math.round(seconds - minutes * 60)
  return {minutes, seconds: newSeconds}
}

export const compressJsonStr = (jsonStr: string) => {
  if (!jsonStr) {
    throw Error('missing data')
  }
  const buf = strToU8(jsonStr)
  const compressed = compressSync(buf, {level: 6, mem: 8})
  return compressed
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

export const writeToLocal = ({
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
  writeFile(path, data, (error) => {
    if (error) throw error
    console.log('Data has been written to the file:', path)
  })
}

export const readLocalFile = async ({pathToFile}: {pathToFile: string}) => {
  if (!pathToFile) {
    throw Error('missing pathToFile')
  }
  const data = await readFile(pathToFile)
  return data
}
